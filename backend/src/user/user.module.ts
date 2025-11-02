import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Oauth, OauthSchema } from '../oauth/schema/Oauth.schema';
import { AreaModule } from '../area/area.module';
import { JwtModule } from '@nestjs/jwt';
import { AreaService } from '../area/area.service';
import { Area, AreaSchema } from '../area/schemas/area.schema';

@Module({
  imports: [
    JwtModule,
    AreaModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Area.name, schema: AreaSchema },
      { name: Oauth.name, schema: OauthSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
