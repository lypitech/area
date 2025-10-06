import { Module } from '@nestjs/common';
import {
  ReactionSelection,
  ReactionSelectionSchema,
} from './schemas/reactionSelection.schema';
import { HttpModule } from '@nestjs/axios';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';
import { Reaction, ReactionSchema } from './schemas/reaction.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscordReactionService } from './services/discord.service';
import { SelectionController } from './selection/selection.controller';
import { SelectionService } from './selection/selection.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Reaction.name, schema: ReactionSchema },
    ]),
    MongooseModule.forFeature([
      { name: ReactionSelection.name, schema: ReactionSelectionSchema },
    ]),
  ],
  controllers: [ReactionController, SelectionController],
  providers: [ReactionService, DiscordReactionService, SelectionService],
  exports: [ReactionService],
})
export class ReactionModule {}
