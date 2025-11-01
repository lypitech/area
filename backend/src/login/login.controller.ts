import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe, Param,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './types/loginDto';
import { CreateUserDto } from './types/createUserDto';
import { RefreshTokenDto } from './types/tokenDto';

@Controller('user')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  register(@Body() userData: CreateUserDto) {
    return this.loginService.register(
      userData.email,
      userData.password,
      userData.nickname,
      userData.username,
      userData.profilePicture ?? '',
    );
  }

  @Post('register/:service')
  registerOauth(@Body('code') code: string, @Param('service') service: string) {
    return this.loginService.registerWith(code, service);
  }

  @Post('login/:service')
  loginOauth(@Body('code') code: string, @Param('service') service: string) {
    return this.loginService.loginWith(code, service);
  }
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() userData: LoginDto) {
    return this.loginService.login(userData.email, userData.password);
  }

  @Post('refresh')
  @UsePipes(new ValidationPipe())
  async refresh(@Body() data: RefreshTokenDto) {
    return this.loginService.refreshToken(data.refresh_token);
  }

  @Post('logout')
  async logout(@Body('uuid') uuid: string) {
    return this.loginService.logout(uuid);
  }
}
