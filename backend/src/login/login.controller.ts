import { Controller, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('login')
@Controller('user')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('register')
  @ApiBody({
    description: 'User registration payload',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'john@example.com' },
        password: { type: 'string', example: 'MyStrongPassword123!' },
        nickname: { type: 'string', example: 'Johnny' },
        username: { type: 'string', example: 'johnny_dev' },
      },
      required: ['email', 'password', 'nickname', 'username'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The newly created user',
    schema: {
      type: 'object',
      properties: {
        nickname: { type: 'string', example: 'Johnny' },
        username: { type: 'string', example: 'jhonny_dev' },
        password: { type: 'string', example: 'Hashed_password' },
        email: { type: 'string', example: 'john@example.com' },
        profilePicture: { type: 'string', example: '' },
        refreshToken: { type: 'string', example: 'refresh_token' },
        _id: { type: 'string', example: 'id (will be removed)' },
        uuid: { type: 'string', example: 'uuid' },
        __v: { type: 'string', example: 'mongoose property (will be removed)' },
      },
    },
  })
  register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('nickname') nickname: string,
    @Body('username') username: string,
  ) {
    return this.loginService.register(email, password, nickname, username);
  }

  @Post('login')
  @ApiBody({
    description: 'User registration payload',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'john@example.com' },
        password: { type: 'string', example: 'MyStrongPassword123!' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User logged in',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        refresh_token: { type: 'string' },
      },
    },
  })
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.loginService.login(email, password);
  }

  @Post('refresh')
  async refresh({ refreshToken }: { refreshToken: string }) {
    return this.loginService.refreshToken(refreshToken);
  }

  @Post('logout')
  async logout(@Body('uuid') uuid: string) {
    return this.loginService.logout(uuid);
  }
}
