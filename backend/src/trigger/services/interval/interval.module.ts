import { Module } from '@nestjs/common';
import { IntervalService } from './interval.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Trigger, TriggerSchema } from 'src/trigger/schemas/trigger.schema';
import { AreaModule } from 'src/area/area.module';
import { ResponseModule } from 'src/response/response.module';

@Module({
  imports: [
    AreaModule,
    ResponseModule,
    MongooseModule.forFeature([{ name: Trigger.name, schema: TriggerSchema }]),
  ],
  providers: [IntervalService],
})
export class IntervalModule {}
