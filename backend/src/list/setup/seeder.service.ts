import { OnApplicationBootstrap, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reaction, ReactionType } from 'src/list/schemas/reaction.schema';
import { Model } from 'mongoose';
import * as fs from 'fs';
import path from 'node:path';
import { Action, ActionType } from '../schemas/action.schema';
import { Service, ServiceType } from '../schemas/service.schema';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger('SeederService');
  constructor(
    @InjectModel(Reaction.name)
    private readonly reactionModel: Model<Reaction>,
    @InjectModel(Action.name)
    private readonly actionModel: Model<Action>,
    @InjectModel(Service.name)
    private readonly serviceModel: Model<Service>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.populate_reactions();
    await this.populate_actions();
    await this.populate_services();
  }

  private async populate_actions() {
    const filePath = path.join('src', 'list', 'setup', 'actions.json');
    const rawFile: string = fs.readFileSync(filePath, 'utf-8');
    const actions: ActionType[] = JSON.parse(rawFile) as ActionType[];
    for (const action of actions) {
      await this.actionModel.updateOne(
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
    const filePath = path.join('src', 'list', 'setup', 'reactions.json');
    const rawFile: string = fs.readFileSync(filePath, 'utf-8');
    const reactions: ReactionType[] = JSON.parse(rawFile) as ReactionType[];
    for (const reaction of reactions) {
      await this.reactionModel.updateOne(
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
    const filePath = path.join('src', 'list', 'setup', 'services.json');
    const rawFile: string = fs.readFileSync(filePath, 'utf-8');
    const services: ServiceType[] = JSON.parse(rawFile) as ServiceType[];
    for (const service of services) {
      const actions: ActionType[] = await this.actionModel.find({
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
      const reactions: ReactionType[] = await this.reactionModel.find({
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
      await this.serviceModel.updateOne(
        { name: service.name },
        { $set: service },
        { upsert: true },
      );
      this.logger.log(
        `Added service ${service.name} with actions: [${service.actions.map((a) => a.name).join(', ')}] and reactions: [${service.reactions.map((a) => a.name).join(', ')}].`,
      );
    }
  }
}
