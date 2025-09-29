import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { MongooseModule } from '@nestjs/mongoose';
import { Reaction, ReactionSchema } from './schemas/reaction.schema';
import { ReactionsService } from './reaction.service';
import { ReactionsController } from './reaction.controller';
=======
import { ReactionService } from './reaction.service';
import {
  ReactionSelection,
  ReactionSelectionSchema,
} from './schemas/reactionSelection.schema';
import { Reaction, ReactionSchema } from './schemas/reaction.schema';
import { MongooseModule } from '@nestjs/mongoose';
>>>>>>> 2e84b49 (feat(backend>reaction): Added `Reaction` module setup)

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reaction.name, schema: ReactionSchema },
    ]),
<<<<<<< HEAD
  ],
  controllers: [ReactionsController],
  providers: [ReactionsService],
  exports: [ReactionsService],
})
export class ReactionsModule {}
=======
    MongooseModule.forFeature([
      { name: ReactionSelection.name, schema: ReactionSelectionSchema },
    ]),
  ],
  providers: [ReactionService],
})
export class ReactionModule {}
>>>>>>> 2e84b49 (feat(backend>reaction): Added `Reaction` module setup)
