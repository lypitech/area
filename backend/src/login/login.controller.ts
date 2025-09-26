import { Controller, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('register')
  register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('nickname') nickname: string,
    @Body('username') username: string,
  ) {
    return this.loginService.register(email, password, nickname, username);
  }

  @Post()
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.loginService.login(email, password);
  }
}
