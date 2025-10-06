import { OnApplicationBootstrap, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ReactionSelection,
  ReactionSelectionType,
} from 'src/reaction/schemas/reactionSelection.schema';
import { Model } from 'mongoose';
import * as fs from 'fs';
import path from 'node:path';

@Injectable()
export class ReactionSelectionSeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger('ReactionSeeder');
  constructor(
    @InjectModel(ReactionSelection.name)
    private readonly reactionSelection: Model<ReactionSelection>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.populate();
  }

  private async populate() {
    const filePath = path.join('src', 'setup', 'reactionSelection.json');
    const rawFile: string = fs.readFileSync(filePath, 'utf-8');
    const reactions: ReactionSelectionType[] = JSON.parse(
      rawFile,
    ) as ReactionSelectionType[];
    for (const reaction of reactions) {
      await this.reactionSelection.updateOne(
        { service_name: reaction.service_name, name: reaction.name },
        { $set: reaction },
        { upsert: true },
      );
      this.logger.log(`Added ${reaction.name} for ${reaction.service_name}.`);
    }
  }
}
