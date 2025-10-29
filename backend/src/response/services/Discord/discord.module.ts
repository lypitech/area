import { Module } from '@nestjs/common';
import { DiscordReactionService } from './discord.service';
import { DiscordResponseDriver } from './discord.driver';
import { HttpModule } from '@nestjs/axios';
import { ServiceModule } from '../../../list/service.module';

@Module({
  imports: [HttpModule, ServiceModule],
  providers: [DiscordReactionService, DiscordResponseDriver],
  exports: [DiscordReactionService, DiscordResponseDriver],
})
export class DiscordModule {}
