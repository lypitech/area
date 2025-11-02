import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Trigger, TriggerSchema } from 'src/trigger/schemas/trigger.schema';
import { ResponseModule } from 'src/response/response.module';
import { IntervalTriggerDriver } from './interval.driver';
import { Area, AreaSchema } from 'src/area/schemas/area.schema';

@Module({
  imports: [
    ResponseModule,
    MongooseModule.forFeature([
      { name: Trigger.name, schema: TriggerSchema },
      { name: Area.name, schema: AreaSchema },
    ]),
  ],
  providers: [SchedulerRegistry, IntervalTriggerDriver],
  exports: [IntervalTriggerDriver],
})
export class IntervalModule {}
