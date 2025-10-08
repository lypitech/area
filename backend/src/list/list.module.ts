import { Module } from '@nestjs/common';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { ReactionListController } from './reaction/reaction-list.controller';
import { ReactionListService } from './reaction/reaction-list.service';
import { ActionListController } from './action/action-list.controller';
import { ActionListService } from './action/action-list.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ReactionList,
  ReactionListSchema,
} from './schemas/reactionList.schema';
import { ActionList, ActionListSchema } from './schemas/actionList.schema';
import { ServiceList, ServiceListSchema } from './schemas/serviceList.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReactionList.name, schema: ReactionListSchema },
      { name: ActionList.name, schema: ActionListSchema },
      { name: ServiceList.name, schema: ServiceListSchema },
    ]),
  ],
  controllers: [ListController, ReactionListController, ActionListController],
  providers: [ListService, ReactionListService, ActionListService],
})
export class ListModule {}
