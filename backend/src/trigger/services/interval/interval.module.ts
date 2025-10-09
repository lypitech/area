import { Module } from '@nestjs/common';
import { IntervalController } from './interval.controller';
import { IntervalService } from './interval.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Trigger, TriggerSchema } from '../../schemas/trigger.schema';
import { AreaModule } from '../../../area/area.module';
import { ResponseModule } from '../../../response/response.module';

@Module({
  imports: [
    AreaModule,
    ResponseModule,
    MongooseModule.forFeature([{ name: Trigger.name, schema: TriggerSchema }]),
  ],
  controllers: [IntervalController],
  providers: [IntervalService],
})
export class IntervalModule {}
