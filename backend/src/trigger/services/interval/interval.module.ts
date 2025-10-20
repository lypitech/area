import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Trigger, TriggerSchema } from '../../schemas/trigger.schema';
import { AreaModule } from '../../../area/area.module';
import { ResponseModule } from '../../../response/response.module';
import { IntervalTriggerDriver } from './interval.driver';
import { TRIGGER_DRIVERS } from '../../tokens';

@Module({
  imports: [
    AreaModule,
    ResponseModule,
    MongooseModule.forFeature([{ name: Trigger.name, schema: TriggerSchema }]),
  ],
  providers: [SchedulerRegistry, IntervalTriggerDriver],
  exports: [IntervalTriggerDriver],
})
export class IntervalModule {}
