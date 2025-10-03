import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { LoginModule } from './login/login.module';
import { ReactionModule } from './reaction/reaction.module';
import { ReactionSelectionSeederService } from './setup/reactionSelection.seeder.service';
import { ActionSelectionSeederService } from './setup/actionSelection.seeder.service';
import { AreaModule } from './area/area.module';
import { ActionModule } from './action/action.module';
import {
  ReactionSelection,
  ReactionSelectionSchema,
} from './reaction/schemas/reactionSelection.schema';
import {
  ActionSelection,
  ActionSelectionSchema,
} from './action/schemas/actionSelection.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017/nestdb'),
    MongooseModule.forFeature([
      { name: ReactionSelection.name, schema: ReactionSelectionSchema },
    ]),
    MongooseModule.forFeature([
      { name: ActionSelection.name, schema: ActionSelectionSchema },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    CommonModule,
    backend
    LoginModule,
    ReactionModule,
    AreaModule,
    ActionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ReactionSelectionSeederService,
    ActionSelectionSeederService,
  ],
})
export class AppModule {}
