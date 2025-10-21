import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { ReactionController } from './reaction/reaction.controller';
import { ReactionService } from './reaction/reaction.service';
import { ActionController } from './action/action.controller';
import { ActionService } from './action/action.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Reaction, ReactionSchema } from './schemas/reaction.schema';
import { Action, ActionSchema } from './schemas/action.schema';
import { Service, ServiceSchema } from './schemas/service.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reaction.name, schema: ReactionSchema },
      { name: Action.name, schema: ActionSchema },
      { name: Service.name, schema: ServiceSchema },
    ]),
  ],
  controllers: [ServiceController, ReactionController, ActionController],
  providers: [ServiceService, ReactionService, ActionService],
  exports: [ServiceService],
})
export class ServiceModule {}
