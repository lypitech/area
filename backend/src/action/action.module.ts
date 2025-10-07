import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Action, ActionSchema } from './schemas/action.schema';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';
import { ReactionModule } from 'src/reaction/reaction.module';
import { AreaModule } from 'src/area/area.module';
import { GithubModule } from './services/github/github.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Action.name, schema: ActionSchema }]),
    ReactionModule,
    AreaModule,
    GithubModule,
  ],
  controllers: [ActionController],
  providers: [ActionService],
  exports: [ActionService],
})
export class ActionModule {}
