import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Action, ActionSchema } from '../schemas/action.schema';
import { ActionService } from './action.service';

@Module({
    imports: [MongooseModule.forFeature([
        { name: Action.name, schema: ActionSchema }])
    ],
    providers: [ActionService],
    exports: [ActionService],
})
export class ActionModule {}