import { OnApplicationBootstrap, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ReactionList,
  ReactionListType,
} from 'src/list/schemas/reactionList.schema';
import { Model } from 'mongoose';
import * as fs from 'fs';
import path from 'node:path';
import { ActionList, ActionListType } from '../schemas/actionList.schema';
import { ServiceList, ServiceListType } from '../schemas/serviceList.schema';

@Injectable()
export class ListSeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger('ListSeederService');
  constructor(
    @InjectModel(ReactionList.name)
    private readonly reactionListModel: Model<ReactionList>,
    @InjectModel(ActionList.name)
    private readonly actionListModel: Model<ActionList>,
    @InjectModel(ServiceList.name)
    private readonly serviceListModel: Model<ServiceList>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.populate_reactions();
    await this.populate_actions();
    await this.populate_services();
  }

  private async populate_actions() {
    const filePath = path.join('src', 'list', 'setup', 'actionList.json');
    const rawFile: string = fs.readFileSync(filePath, 'utf-8');
    const actions: ActionListType[] = JSON.parse(rawFile) as ActionListType[];
    for (const action of actions) {
      await this.actionListModel.updateOne(
        { service_name: action.service_name, name: action.name },
        { $set: action },
        { upsert: true },
      );
      this.logger.log(
        `Added action ${action.name} for ${action.service_name}.`,
      );
    }
  }

  private async populate_reactions() {
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
      this.logger.log(
        `Added reaction ${reaction.name} for ${reaction.service_name}.`,
      );
    }
  }

  private async populate_services() {
    const filePath = path.join('src', 'list', 'setup', 'serviceList.json');
    const rawFile: string = fs.readFileSync(filePath, 'utf-8');
    const services: ServiceListType[] = JSON.parse(
      rawFile,
    ) as ServiceListType[];
    for (const service of services) {
      const actions = await this.actionListModel.find({
        service_name: service.name,
      });
      const actionList: object[] = [];
      for (const action of actions) {
        actionList.push({
          uuid: action.uuid,
          name: action.name,
          description: action.description,
        });
      }
      service.actions = actionList;
      const reactions = await this.reactionListModel.find({
        service_name: service.name,
      });
      const reactionList: object[] = [];
      for (const reaction of reactions) {
        reactionList.push({
          uuid: reaction.uuid,
          name: reaction.name,
          description: reaction.description,
        });
      }
      service.reactions = reactionList;
      await this.serviceListModel.updateOne(
        { name: service.name },
        { $set: service },
        { upsert: true },
      );
      this.logger.log(
        `Added service ${service.name} with actions: ${JSON.stringify(service.actions)} and reactions: ${JSON.stringify(service.reactions)}.`,
      );
    }
  }
}
