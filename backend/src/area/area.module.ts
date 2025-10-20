import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Area, AreaSchema } from './schemas/area.schema';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { Trigger, TriggerSchema } from 'src/trigger/schemas/trigger.schema';
import {
  ReactionInstance,
  ResponseSchema,
} from 'src/response/schemas/response.schema';
import { UserService } from 'src/user/user.service';
import { OauthService } from 'src/oauth/oauth.service';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { HttpModule } from '@nestjs/axios';
import { Oauth, OauthSchema } from 'src/oauth/schema/Oauth.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Area.name, schema: AreaSchema },
      { name: Trigger.name, schema: TriggerSchema },
      { name: ReactionInstance.name, schema: ResponseSchema },
      { name: User.name, schema: UserSchema },
      { name: Oauth.name, schema: OauthSchema },
    ]),
  ],
  controllers: [AreaController],
  providers: [AreaService, UserService, OauthService],
  exports: [AreaService],
})
export class AreaModule {}
