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
    @InjectModel(ReactionInstance.name) private reactionModel: Model<ReactionInstance>,
    @Inject(DiscordReactionService) private discord: DiscordReactionService,
  ) {}
  private readonly logger = new ConsoleLogger(ResponseService.name);

  async findAll(): Promise<ReactionInstance[]> {
    return this.reactionModel.find().exec();
  }

  async findByUUID(uuid: string): Promise<ReactionInstance | null> {
    return this.reactionModel.findOne({ uuid }).lean().exec();
  }

  async create(data: Partial<ReactionInstance>): Promise<ReactionInstance> {
    const doc = new this.reactionModel(data);
    const saved = await doc.save();
    return saved.toObject();
  }

  async remove(uuid: string): Promise<{ deleted: true; uuid: string }> {
    const res = await this.reactionModel
      .findOneAndDelete({ uuid })
      .lean()
      .exec();
    if (!res) throw new NotFoundException('Reaction not found');
    return { deleted: true, uuid };
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
