import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Area, AreaSchema } from './schemas/area.schema';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { Trigger, TriggerSchema } from 'src/trigger/schemas/trigger.schema';
import { Reaction, ResponseSchema } from 'src/response/schemas/response.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Area.name, schema: AreaSchema }]),
    MongooseModule.forFeature([{ name: Trigger.name, schema: TriggerSchema }]),
    MongooseModule.forFeature([
      { name: Reaction.name, schema: ResponseSchema },
    ]),
  ],
  controllers: [AreaController],
  providers: [AreaService],
  exports: [AreaService],
})
export class AreaModule {}
