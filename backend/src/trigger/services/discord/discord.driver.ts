import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { TriggerDriver } from 'src/trigger/contracts/trigger-driver';
import { Trigger } from 'src/trigger/schemas/trigger.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Area } from 'src/area/schemas/area.schema';
import { ResponseService } from 'src/response/response.service';
import { ServiceService } from 'src/list/service.service';
import { WebSocket } from 'ws';
import { DiscordTriggerService } from './discord.service';
import { discord_op } from './types';
import { AreaService } from 'src/area/area.service';

type CreateParams = object;

@Injectable()
export class DiscordTriggerDriver implements TriggerDriver, OnModuleInit {
  readonly key = 'discord:app';
  private ws: WebSocket;
  private readonly logger = new Logger(DiscordTriggerDriver.name);
  triggers: string[] = [];

  constructor(
    private readonly discordService: DiscordTriggerService,
    private readonly serviceService: ServiceService,
    private readonly areaService: AreaService,
    @InjectModel(Trigger.name) private readonly triggerModel: Model<Trigger>,
    @InjectModel(Area.name) private readonly areaModel: Model<Area>,
    private readonly responseService: ResponseService,
  ) {
    this.logger.verbose(`[DiscordTriggerDriver] New instance created`);
  }

  async onModuleInit(): Promise<any> {
    const tmp = await this.serviceService.getActionsByServiceName('Discord');
    for (const res of tmp) {
      this.triggers.push(res);
    }
    this.logger.log('Connecting to discord Gateway...');
    this.connectGateway();
  }

  private connectGateway() {
    if (this.ws) this.ws.removeAllListeners();
    this.ws = new WebSocket('wss://gateway.discord.gg/?v=10&encoding=json');
    this.ws.on('open', () => this.logger.log('Websocket Connected.'));
    this.ws.on('message', (message) => this.handleGatewayEvent(message));

    this.ws.once('close', (code, reason) => {
      this.logger.warn(`WebSocket closed (${code}): ${reason}`);
      this.discordService.stopHeartbeat();
      this.ws.removeAllListeners();
      setTimeout(() => this.connectGateway(), 5000);
    });

    this.ws.on('error', (err) => {
      this.logger.error(`WebSocket error: ${err.message}`);
    });
  }

  async handleGatewayEvent(message) {
    const payload = JSON.parse(message.toString());
    const { t, s, op, d } = payload;

    if (s) this.discordService.setLastSeq(s);

    switch (op) {
      case discord_op.HELLO:
        this.discordService.handleHello(this.ws, d);
        break;
      case discord_op.HEARTBEAT:
        this.logger.verbose('Heartbeat ACK');
        break;
      case discord_op.DISPATCH:
        await this.handleDispatch(t, d);
        break;
      case discord_op.RECONNECT:
        this.logger.warn('Gateway requested reconnect');
        this.discordService.reconnect(this.ws);
        break;
      case discord_op.INVALID:
        this.logger.warn('Invalid session, re-identifying soon...');
        setTimeout(() => this.discordService.identify(this.ws), 5000);
        break;
      default:
        this.logger.debug(`Unhandled opcode: [${op}]`);
    }
  }

  async handleDispatch(event, data) {
    switch (event) {
      case 'READY':
        this.discordService.setSessionId(data.session_id as string);
        this.logger.log(
          `READY: Session ID: ${this.discordService.getSessionId()}`,
        );
        break;
      case 'MESSAGE_CREATE':
        await this.handle_message('New message', data);
        break;
      case 'MESSAGE_REACTION_ADD':
        await this.handle_reaction('New reaction', data);
        break;
      default:
        await this.handle_basic_trigger(event as string, data);
        break;
    }
  }

  private async handle_basic_trigger(event_name: string, payload) {
    let name = event_name.replace(/_/g, ' ');
    name = name.toLowerCase();
    name = name.charAt(0).toUpperCase() + name.slice(1);
    if (name.startsWith('Message')) return this.handle_message(name, payload);
    const triggers: Trigger[] = await this.triggerModel.find({
      name: name,
    });
    for (const trigger of triggers) {
      if (trigger.input?.guild_id !== payload.guild_id) continue;
      if (!trigger.input?.channel_id) {
        await this.fire(trigger, payload);
        continue;
      }
      if (trigger.input?.channel_id === payload.channel_id)
        await this.fire(trigger, payload);
    }
  }

  private async handle_reaction(event_name, payload) {
    const triggers: Trigger[] = await this.triggerModel.find({
      name: event_name,
    });
    for (const trigger of triggers) {
      if (trigger.input?.guild_id !== payload.guild_id) continue;
      if (trigger.input?.message_id) {
        if (trigger.input?.message_id !== payload.message_id) continue;
        await this.fire(trigger, payload);
        continue;
      }
      await this.fire(trigger, payload);
    }
  }

  private async handle_message(event_name: string, payload: any) {
    if (payload.author.id === process.env.DISCORD_APP_ID) return;
    const triggers: Trigger[] = await this.triggerModel.find({
      name: event_name,
    });
    for (const trigger of triggers) {
      if (trigger.input?.guild_id !== payload.guild_id) continue;
      if (!trigger.input?.channel_id) {
        await this.fire(trigger, payload);
        continue;
      }
      if (trigger.input?.channel_id === payload.channel_id)
        await this.fire(trigger, payload);
    }
  }

  supports(trigger: Trigger): boolean {
    if (trigger.service_name != 'Discord') return false;
    return trigger.name in this.triggers;
  }

  private async findEnabledAreaByTriggerUUID(
    trigger_uuid: string,
  ): Promise<Area | null> {
    const now = new Date();
    const area: Area | null = await this.areaModel.findOne({
      trigger_uuid,
      enabled: true,
      $or: [{ disabled_until: null }, { disabled_until: { $lte: now } }],
    });
    if (area) {
      return area;
    }
    return null;
  }

  async onCreate(
    trigger: Trigger,
    params?: Partial<CreateParams>,
  ): Promise<void> {
    return;
  }

  async onRemove(trigger: Trigger, _params?: any) {}

  async fire(trigger: Trigger, payload?: Record<string, any>): Promise<void> {
    const area = await this.findEnabledAreaByTriggerUUID(trigger.uuid);
    if (!area) {
      return;
    }
    const response = await this.responseService.findByUUID(
      area.response_uuid,
    );
    if (!payload) payload = {};
    if (!response) throw new NotFoundException('Response not found');
    const result = await this.responseService.dispatch(response, payload);
    await this.areaService.appendHistory(area.uuid, result.ok ? 'ok' : 'ko');
  }
}
