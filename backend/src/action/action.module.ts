import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Action, ActionSchema } from './schemas/action.schema';
import {
  ActionSelection,
  ActionSelectionSchema,
} from './schemas/actionSelection.schema';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';
import { ReactionModule } from 'src/reaction/reaction.module';
import { AreaModule } from 'src/area/area.module';
import { GithubModule } from './services/github/github.module';
import { SelectionController } from './selection/selection.controller';
import { ActionSelectionService } from './selection/selection.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Action.name, schema: ActionSchema },
      { name: ActionSelection.name, schema: ActionSelectionSchema },
    ]),
    ReactionModule,
    AreaModule,
    GithubModule,
  ],
  controllers: [ActionController, SelectionController],
  providers: [ActionService, ActionSelectionService],
  exports: [ActionService],
})
export class ActionModule {}
