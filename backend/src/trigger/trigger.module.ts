import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Trigger, TriggerSchema } from './schemas/trigger.schema';
import { TriggerService } from './trigger.service';
import { TRIGGER_DRIVERS } from './tokens';
import { IntervalModule } from './services/interval/interval.module';
import { GithubModule } from './services/github/github.module';
import { IntervalTriggerDriver } from './services/interval/interval.driver';
import { GithubWebhookTriggerDriver } from './services/github/github.driver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Trigger.name, schema: TriggerSchema }]),
    IntervalModule,
    GithubModule,
  ],
  providers: [
    TriggerService,
    {
      provide: TRIGGER_DRIVERS,
      useFactory: (
        interval: IntervalTriggerDriver,
        github: GithubWebhookTriggerDriver,
      ) => [interval, github],
      inject: [IntervalTriggerDriver, GithubWebhookTriggerDriver],
    },
  ],
  exports: [TriggerService],
})
export class TriggerModule {}
