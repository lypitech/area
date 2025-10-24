import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReactionInstance } from './schemas/response.schema';
import { DiscordReactionService } from './services/discord.service';
import { ResponseCreationDto } from './types/responseCreationDto';
import { DispatchFunction } from './types/dispatchFunction';

@Injectable()
export class ResponseService {
  private readonly dispatchers = new Map<string, DispatchFunction>();
  constructor(
    @InjectModel(ReactionInstance.name)
    private responseModel: Model<ReactionInstance>,
    @Inject(DiscordReactionService) private discord: DiscordReactionService,
  ) {
    this.dispatchers.set('Discord', (reaction, payload) => {
      return this.discord.dispatch(reaction, payload);
    });
  }

  async create(data: ResponseCreationDto) {
    const response: ReactionInstance = await this.responseModel.create(data);
    return response.uuid;
  }

  async findByUUID(uuid: string): Promise<ReactionInstance | null> {
    const response: ReactionInstance | null = await this.responseModel.findOne({
      uuid,
    });
    if (!response) {
      throw new NotFoundException(`No Response with uuid ${uuid}`);
    }
    return response;
  }

  dispatch(reaction: ReactionInstance, action_payload: Record<string, any>) {
    const service_name = reaction.service_name.toLowerCase();
    const dispatcher = this.dispatchers.get(service_name);
    if (!dispatcher) {
      throw new NotFoundException(`No dispatcher for ${service_name}.`);
    }
    return dispatcher(reaction, action_payload);
  }
}
