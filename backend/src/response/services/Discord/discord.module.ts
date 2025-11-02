import { Module } from '@nestjs/common';
import { DiscordReactionService } from './discord.service';
import { DiscordResponseDriver } from './discord.driver';
import { HttpModule } from '@nestjs/axios';
import { ServiceModule } from '../../../list/service.module';
import { JwtModule } from '@nestjs/jwt';
import { UtilsService } from '../../utils.service';

@Module({
  imports: [JwtModule, HttpModule, ServiceModule],
  providers: [UtilsService, DiscordReactionService, DiscordResponseDriver],
  exports: [DiscordReactionService, DiscordResponseDriver],
})
export class DiscordModule {}
