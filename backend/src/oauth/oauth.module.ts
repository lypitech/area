import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { HttpModule } from '@nestjs/axios';
import { Oauth, OauthSchema } from './schema/Oauth.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule,
    HttpModule,
    MongooseModule.forFeature([
      { name: Oauth.name, schema: OauthSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [OauthService],
  controllers: [OauthController],
})
export class OauthModule {}
