import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { RegisterMiddleware } from '../common/middleware/register.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'default_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [LoginService],
  controllers: [LoginController],
})
export class LoginModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RegisterMiddleware).forRoutes('user/register');
  }
}
