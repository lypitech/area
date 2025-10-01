import { Module } from '@nestjs/common';
import {
  ReactionSelection,
  ReactionSelectionSchema,
} from './schemas/reactionSelection.schema';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';
import { Reaction, ReactionSchema } from './schemas/reaction.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reaction.name, schema: ReactionSchema },
    ]),
    MongooseModule.forFeature([
      { name: ReactionSelection.name, schema: ReactionSelectionSchema },
    ]),
  ],
  controllers: [ReactionController],
  providers: [ReactionService],
  exports: [ReactionService],
})
export class ReactionModule {}
