import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { TriggerDriver } from 'src/trigger/contracts/trigger-driver';
import { Trigger } from 'src/trigger/schemas/trigger.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Area } from 'src/area/schemas/area.schema';
import { ResponseService } from 'src/response/response.service';
import { ServiceService } from 'src/list/service.service';
import { WebSocket } from 'ws';
import { DiscordTriggerService } from './discord.service';

type CreateParams = {
  owner: string;
  repo: string;
  event?: string;
};

const ALLOWED_EVENTS = new Set<string>(['push', 'pull_request', 'issues']);

function normalizeEvent(input?: string): string {
  const value = (input ?? '').trim();
  if (value && ALLOWED_EVENTS.has(value)) return value;
  return 'push';
}

@Injectable()
export class DiscordTriggerDriver implements TriggerDriver, OnModuleInit {
  readonly key = 'discord:app';
  private ws: WebSocket;
  private readonly logger = new Logger(DiscordTriggerDriver.name);
  triggers: string[] = [];

  constructor(
    private readonly discordService: DiscordTriggerService,
    private readonly serviceService: ServiceService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
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
    // this.logger.log('Connecting to discord Gateway...');
    // this.connectGateway();
    // this.logger.log('Successfully connected to discord Gateway');
  }

  private connectGateway() {
    if (this.ws) this.ws.removeAllListeners();
    this.ws = new WebSocket('wss://gateway.discord.gg/?v=10&encoding=json');
    this.ws.on('open', () => {
      this.logger.log('Websocket Connected.');
    });
    this.ws.on('message', (message) => {
      this.discordService.handleGatewayMessage(this.ws, message);
    });

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

  supports(trigger: Trigger): boolean {
    if (trigger.service_name != 'Discord') return false;
    return trigger.name in this.triggers;
  }

  private async findEnabledAreaByTriggerUUID(
    trigger_uuid: string,
  ): Promise<Area[]> {
    const now = new Date();
    return this.areaModel
      .find({
        trigger_uuid,
        enabled: true,
        $or: [{ disabled_until: null }, { disabled_until: { $lte: now } }],
      })
      .lean()
      .exec();
  }

  async onCreate(
    trigger: Trigger,
    params?: Partial<CreateParams>,
  ): Promise<void> {
    return;
  }

  async onRemove(trigger: Trigger, _params?: any) {}

  async fire(trigger: Trigger, payload?: Record<string, any>): Promise<void> {}
}
