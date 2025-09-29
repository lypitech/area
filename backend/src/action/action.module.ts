import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Action, ActionSchema } from './schemas/action.shemas';
import { ActionsService } from './action.service';
import { ActionsController } from './action.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Action.name, schema: ActionSchema }]),
  ],
  controllers: [ActionsController],
  providers: [ActionsService],
})
export class ActionsModule {}
