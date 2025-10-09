import { Module } from '@nestjs/common';
import { HookController } from './hook.controller';
import { HookService } from './hook.service';
import { TriggerModule } from '../trigger/trigger.module';

@Module({
  imports: [TriggerModule],
  controllers: [HookController],
  providers: [HookService],
  exports: [HookService],
})
export class HookModule {}
