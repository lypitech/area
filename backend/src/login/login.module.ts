import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { RegisterMiddleware } from '../common/middleware/register.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import { OauthService } from '../oauth/oauth.service';
import { HttpModule } from '@nestjs/axios';
import { Oauth, OauthSchema } from 'src/oauth/schema/Oauth.schema';

@Module({
  imports: [
    HttpModule,
    UserModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Oauth.name, schema: OauthSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'default_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [OauthService, LoginService],
  controllers: [LoginController],
})
export class LoginModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RegisterMiddleware).forRoutes('user/register');
  }
}
