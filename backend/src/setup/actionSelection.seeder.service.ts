import { OnApplicationBootstrap, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ActionSelection,
  ActionSelectionType,
} from 'src/action/schemas/actionSelection.schema';
import { Model } from 'mongoose';
import * as fs from 'fs';
import path from 'node:path';

@Injectable()
export class ActionSelectionSeederService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(ActionSelection.name)
    private readonly actionSelection: Model<ActionSelection>,
  ) {}

  onApplicationBootstrap() {
    this.populate();
  }

  private populate() {
    const filePath = path.join('src', 'setup', 'actionSelection.json');
    const rawFile: string = fs.readFileSync(filePath, 'utf-8');
    const services: ActionSelectionType[] = JSON.parse(
      rawFile,
    ) as ActionSelectionType[];
    for (const service of services) {
      this.actionSelection.updateOne(
        { service_name: service.service_name, name: service.name },
        { $set: service },
        { upsert: true },
      );
    }
  }
}
