import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { Area, AreaSchema } from './schemas/area.schema';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { UserService } from 'src/user/user.service';
import { OauthService } from 'src/oauth/oauth.service';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { Oauth, OauthSchema } from 'src/oauth/schema/Oauth.schema';
import { TriggerModule } from '../trigger/trigger.module';
import { ServiceModule } from '../list/service.module';
import { ResponseModule } from '../response/response.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule,
    HttpModule,
    TriggerModule,
    ServiceModule,
    ResponseModule,
    MongooseModule.forFeature([
      { name: Area.name, schema: AreaSchema },
      { name: User.name, schema: UserSchema },
      { name: Oauth.name, schema: OauthSchema },
    ]),
  ],
  controllers: [AreaController],
  providers: [AreaService, UserService, OauthService],
  exports: [AreaService],
})
export class AreaModule {}
