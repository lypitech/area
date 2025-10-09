import { Module } from '@nestjs/common';
import { IntervalController } from './interval.controller';
import { IntervalService } from './interval.service';

@Module({
  controllers: [IntervalController],
  providers: [IntervalService],
})
export class IntervalModule {}
