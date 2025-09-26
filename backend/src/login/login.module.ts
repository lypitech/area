import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'default_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [LoginService],
  controllers: [LoginController],
})
export class LoginModule {}
