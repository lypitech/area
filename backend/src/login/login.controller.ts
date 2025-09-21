import { Controller, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('register')
  register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name: string,
  ) {
    return this.loginService.register(email, password, name);
  }

  @Post()
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.loginService.login(email, password);
  }
}
