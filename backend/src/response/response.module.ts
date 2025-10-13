import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ResponseService } from './response.service';
import { ReactionInstance, ResponseSchema } from './schemas/response.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscordReactionService } from './services/discord.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: ReactionInstance.name, schema: ResponseSchema },
    ]),
  ],
  providers: [ResponseService, DiscordReactionService],
  exports: [ResponseService],
})
export class ResponseModule {}
