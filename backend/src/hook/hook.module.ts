import { Module } from '@nestjs/common';
import { HookController } from './hook.controller';
import { HookService } from './hook.service';
import { ActionModule } from '../action/action.module';

@Module({
  imports: [ActionModule],
  controllers: [HookController],
  providers: [HookService],
  exports: [HookService],
})
export class HookModule {}
