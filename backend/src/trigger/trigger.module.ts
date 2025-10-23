import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Trigger, TriggerSchema } from './schemas/trigger.schema';
import { TriggerService } from './trigger.service';
import { IntervalModule } from './services/interval/interval.module';
import { GithubModule } from './services/github/github.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Trigger.name, schema: TriggerSchema }]),
    IntervalModule,
    GithubModule,
  ],
  providers: [TriggerService],
  exports: [TriggerService],
})
export class TriggerModule {}
