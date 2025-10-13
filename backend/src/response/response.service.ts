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

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel(ReactionInstance.name)
    private responseModel: Model<ReactionInstance>,
    @Inject(DiscordReactionService) private discord: DiscordReactionService,
  ) {}
  private readonly logger = new ConsoleLogger(ResponseService.name);

  async findByUUID(uuid: string): Promise<ReactionInstance | null> {
    const response: ReactionInstance | null = await this.responseModel.findOne({
      uuid,
    });
    if (!response) {
      throw new NotFoundException(`No Response with uuid ${uuid}`);
    }
    return response;
  }

  async dispatch(reaction: ReactionInstance, action_payload: string) {
    const service_name = reaction.service_name.toLowerCase();
    switch (service_name) {
      case 'discord':
        return this.discord.dispatch(reaction, action_payload);
      default:
        throw new NotFoundException(`Unsupported service '${service_name}'`);
    }
  }
}
