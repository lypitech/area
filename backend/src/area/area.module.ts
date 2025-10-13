import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Area, AreaSchema } from './schemas/area.schema';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { Action, ActionSchema } from 'src/action/schemas/action.schema';
import { Reaction, ReactionSchema } from 'src/reaction/schemas/reaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Area.name, schema: AreaSchema }]),
    MongooseModule.forFeature([{ name: Action.name, schema: ActionSchema }]),
    MongooseModule.forFeature([
      { name: Reaction.name, schema: ReactionSchema },
    ]),
  ],
  controllers: [AreaController],
  providers: [AreaService],
  exports: [AreaService],
})
export class AreaModule {}
