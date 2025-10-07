import { OnApplicationBootstrap, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ReactionList,
  ReactionListType,
} from 'src/list/schemas/reactionList.schema';
import { Model } from 'mongoose';
import * as fs from 'fs';
import path from 'node:path';

@Injectable()
export class ReactionListSeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger('ReactionListSeeder');
  constructor(
    @InjectModel(ReactionList.name)
    private readonly reactionListModel: Model<ReactionList>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.populate();
  }

  private async populate() {
    const filePath = path.join('src', 'list', 'setup', 'reactionList.json');
    const rawFile: string = fs.readFileSync(filePath, 'utf-8');
    const reactions: ReactionListType[] = JSON.parse(
      rawFile,
    ) as ReactionListType[];
    for (const reaction of reactions) {
      await this.reactionListModel.updateOne(
        { service_name: reaction.service_name, name: reaction.name },
        { $set: reaction },
        { upsert: true },
      );
      this.logger.log(`Added ${reaction.name} for ${reaction.service_name}.`);
    }
  }
}
