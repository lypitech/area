import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Trigger, TriggerSchema } from './schemas/trigger.schema';
import { TriggerService } from './trigger.service';
import { ResponseModule } from 'src/response/response.module';
import { AreaModule } from 'src/area/area.module';
import { GithubModule } from './services/github/github.module';
import { IntervalTriggerService } from './services/interval/interval.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Trigger.name, schema: TriggerSchema }]),
    ResponseModule,
    AreaModule,
    GithubModule,
  ],
  providers: [TriggerService, IntervalTriggerService],
  exports: [TriggerService],
})
export class TriggerModule {}
