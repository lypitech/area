import { OnApplicationBootstrap, Injectable } from '@nestjs/common';
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
  constructor(
    @InjectModel(ReactionSelection.name)
    private readonly reactionSelection: Model<ReactionSelection>,
  ) {}

  onApplicationBootstrap() {
    this.populate();
  }

  private populate() {
    const filePath = path.join('src', 'setup', 'reactionSelection.json');
    const rawFile: string = fs.readFileSync(filePath, 'utf-8');
    const services: ReactionSelectionType[] = JSON.parse(
      rawFile,
    ) as ReactionSelectionType[];
    for (const service of services) {
      this.reactionSelection.updateOne(
        { service_name: service.service_name, name: service.name },
        { $set: service },
        { upsert: true },
      );
    }
  }
}
