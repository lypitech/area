import { OnApplicationBootstrap, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ActionList,
  ActionListType,
} from 'src/list/schemas/actionList.schema';
import { Model } from 'mongoose';
import * as fs from 'fs';
import path from 'node:path';

@Injectable()
export class ActionListSeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger('ActionListSeeder');
  constructor(
    @InjectModel(ActionList.name)
    private readonly actionListModel: Model<ActionList>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.populate();
  }

  private async populate() {
    const filePath = path.join('src', 'list', 'setup', 'actionList.json');
    const rawFile: string = fs.readFileSync(filePath, 'utf-8');
    const actions: ActionListType[] = JSON.parse(rawFile) as ActionListType[];
    for (const action of actions) {
      await this.actionListModel.updateOne(
        { service_name: action.service_name, name: action.name },
        { $set: action },
        { upsert: true },
      );
      this.logger.log(`Added ${action.name} for ${action.service_name}.`);
    }
  }
}
