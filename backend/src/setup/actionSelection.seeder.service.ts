import { OnApplicationBootstrap, Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger('ActionSeeder');
  constructor(
    @InjectModel(ActionSelection.name)
    private readonly actionSelection: Model<ActionSelection>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.populate();
  }

  private async populate() {
    const filePath = path.join('src', 'setup', 'actionSelection.json');
    const rawFile: string = fs.readFileSync(filePath, 'utf-8');
    const actions: ActionSelectionType[] = JSON.parse(
      rawFile,
    ) as ActionSelectionType[];
    for (const action of actions) {
      await this.actionSelection.updateOne(
        { service_name: action.service_name, name: action.name },
        { $set: action },
        { upsert: true },
      );
      this.logger.log(`Added ${action.name} for ${action.service_name}.`);
    }
  }
}
