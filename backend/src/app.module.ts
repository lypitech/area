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
import { ReactionListSeederService } from './list/setup/reactionList.seeder.service';
import { ActionListSeederService } from './list/setup/actionList.seeder.service';
import { AreaModule } from './area/area.module';
import { ActionModule } from './action/action.module';
import {
  ReactionList,
  ReactionListSchema,
} from './list/schemas/reactionList.schema';
import {
  ActionList,
  ActionListSchema,
} from './list/schemas/actionList.schema';
import { HookModule } from './hook/hook.module';
import { ListModule } from './list/list.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017/nestdb'),
    MongooseModule.forFeature([
      { name: ReactionList.name, schema: ReactionListSchema },
    ]),
    MongooseModule.forFeature([
      { name: ActionList.name, schema: ActionListSchema },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    CommonModule,
    //backend,
    LoginModule,
    ReactionModule,
    AreaModule,
    ActionModule,
    HookModule,
    ListModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ReactionListSeederService,
    ActionListSeederService,
  ],
})
export class AppModule {}
