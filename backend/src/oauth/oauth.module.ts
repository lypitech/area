import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { UserModule } from '../user/user.module';
import { HttpModule } from '@nestjs/axios';
import { Oauth, OauthSchema } from './schema/Oauth.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UserModule,
    HttpModule,
    MongooseModule.forFeature([{ name: Oauth.name, schema: OauthSchema }]),
  ],
  providers: [OauthService],
  controllers: [OauthController],
})
export class OauthModule {}
