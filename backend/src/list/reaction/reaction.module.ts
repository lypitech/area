import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reaction, ReactionSchema } from '../schemas/reaction.schema';
import { ReactionService } from './reaction.service';

@Module({
    imports: [MongooseModule.forFeature([
        { name: Reaction.name, schema: ReactionSchema }])
    ],
    providers: [ReactionService],
    exports: [ReactionService],
})
export class ReactionModule {}
