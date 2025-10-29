import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ResponseDriver } from 'src/response/services/contracts/response-driver';
import { ServiceService } from 'src/list/service.service';
import { ResponseCreationDto } from '../../types/responseCreationDto';
import { DiscordReactionService } from './discord.service';
import { ReactionInstance } from '../../schemas/response.schema';
import { DispatchFunction } from '../../types/dispatchFunction';

@Injectable()
export class DiscordResponseDriver
  implements ResponseDriver, OnModuleInit, OnModuleDestroy
{
  readonly key = 'Discord';
  responses: string[] = [];
  private readonly logger = new Logger('DiscordDriver');
  readonly responseValidator = new Map<
    string,
    (response: ResponseCreationDto) => Promise<boolean>
  >();
  private readonly dispatchers = new Map<string, DispatchFunction>();
  constructor(
    private readonly serviceService: ServiceService,
    private readonly discordService: DiscordReactionService,
  ) {
    this.dispatchers.set('Send message', (reaction, payload) => {
      return this.discordService.sendMessage(reaction, payload);
    });
    this.dispatchers.set('Add role', (reaction, payload) => {
      return this.discordService.addRole(reaction, payload);
    });
    this.responseValidator.set('Send message', (response) => {
      return this.sendMessageValidator(response);
    });
    this.responseValidator.set('Add role', (response) => {
      return this.addRoleValidator(response);
    });
  }

  dispatch(reaction: ReactionInstance, action_payload: Record<string, any>) {
    const reaction_name: string = reaction.name;
    const dispatcher = this.dispatchers.get(reaction_name); // Map method
    if (!dispatcher) {
      throw new NotFoundException(`No dispatcher for ${reaction_name}.`);
    }
    return dispatcher(reaction, action_payload);
  }

  private permissionBit(name: string): bigint {
    const map: Record<string, bigint> = {
      ViewChannel: 0x00000400n,
      SendMessages: 0x00000800n,
      ManageRoles: 0x10000000n,
      ReadMessageHistory: 0x00010000n,
    };
    return map[name] ?? 0n;
  }

  private async assertChannelPermissions(
    channelId: string,
    required: string[],
  ) {
    const guildId = await this.discordService.getGuildId(channelId);

    if (!guildId) {
      throw new HttpException('This channel is not part of a server', 400);
    }

    const me = await this.discordService.getMe(guildId);
    const botRoleIds: string[] = me.roles as string[];

    const roles = await this.discordService.getRoles(guildId);
    const channel = await this.discordService.getGuildChannel(channelId);

    let permissions = BigInt(0);
    for (const role of roles) {
      if (botRoleIds.includes(role.id)) {
        permissions |= BigInt(role.permissions);
      }
    }

    for (const overwrite of channel.permission_overwrites) {
      if (overwrite.id === me.user.id) {
        permissions &= ~BigInt(overwrite.deny);
        permissions |= BigInt(overwrite.allow);
      }
      if (botRoleIds.includes(overwrite.id)) {
        permissions &= ~BigInt(overwrite.deny);
        permissions |= BigInt(overwrite.allow);
      }
    }

    const missing = required.filter(
      (perm) => !(permissions & this.permissionBit(perm)),
    );

    if (missing.length) {
      throw new HttpException(
        `Missing permissions: ${missing.join(', ')}`,
        403,
      );
    }

    return true;
  }

  private async assertRolePermissions(guild_id: string) {
    const me = await this.discordService.getMe(guild_id);
    const roles = await this.discordService.getRoles(guild_id);

    let my_permissions = BigInt(0);
    for (const roleId of me.roles) {
      const role = roles.find((r) => r.id === roleId);
      if (role) {
        my_permissions |= BigInt(role.permissions);
      }
    }
    const MANAGE_ROLES = 0x10000000n;
    return (my_permissions & MANAGE_ROLES) === MANAGE_ROLES;
  }

  onModuleDestroy(): any {}

  async onModuleInit(): Promise<any> {
    const tmp = await this.serviceService.getReactionsByServiceName(this.key);
    for (const res of tmp) {
      this.responses.push(res);
    }
  }

  async onCreate(response: ResponseCreationDto): Promise<void> {
    const validator = this.responseValidator.get(response.name);
    if (!validator) {
      this.logger.warn(`Validator not found for ${response.name}.`);
      throw new NotFoundException(
        `No Discord response ${response.service_name}.`,
      );
    }
    if (!(await validator(response))) {
      throw new BadRequestException(
        'The bot is missing the manage roles right in the server.',
      );
    }
  }

  supports(response: ResponseCreationDto): boolean {
    if (response.service_name != this.key) return false;
    for (const res of this.responses) {
      if (response.name === res) return true;
    }
    return false;
  }

  private async sendMessageValidator(response: ResponseCreationDto) {
    const resource_ids: string[] = response.resource_ids ?? [];
    if (resource_ids.length !== 1)
      throw new BadRequestException(
        resource_ids.length > 1
          ? 'There must be a single element in resource_ids.'
          : 'Missing field resource_ids.',
      );
    return await this.assertChannelPermissions(resource_ids[0], [
      'ViewChannel',
      'SendMessages',
    ]);
  }

  private async addRoleValidator(response: ResponseCreationDto) {
    const resource_ids: string[] = response.resource_ids ?? [];
    if (resource_ids.length !== 3)
      throw new BadRequestException(
        resource_ids.length > 3
          ? 'There must be a single element in resource_ids.'
          : 'Missing field resource_ids.',
      );
    return await this.assertRolePermissions(resource_ids[0]);
  }
}
