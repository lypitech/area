import {
  ConsoleLogger,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReactionInstance } from './schemas/response.schema';
import { DiscordReactionService } from './services/discord.service';

export type DispatchFunction = (
  reaction: ReactionInstance,
  str: string,
) => void;

@Injectable()
export class ResponseService {
  private readonly dispatchers = new Map<string, DispatchFunction>();
  private readonly logger = new ConsoleLogger(ResponseService.name);
  constructor(
    @InjectModel(ReactionInstance.name)
    private responseModel: Model<ReactionInstance>,
    @Inject(DiscordReactionService) private discord: DiscordReactionService,
  ) {
    this.dispatchers.set('Discord', (reaction, str) => {
      this.discord.dispatch(reaction, str);
    });
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

  dispatch(reaction: ReactionInstance, action_payload: string) {
    const service_name = reaction.service_name.toLowerCase();
    const dispatcher = this.dispatchers.get(service_name);
    if (!dispatcher) {
      throw new NotFoundException(`No dispatcher for ${service_name}.`);
    }
    dispatcher(reaction, action_payload);
  }
}
