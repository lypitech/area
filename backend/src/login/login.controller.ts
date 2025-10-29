import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './types/loginDto';
import { CreateUserDto } from './types/createUserDto';
import { RefreshTokenDto } from './types/tokenDto';

@ApiTags('login')
@Controller('user')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiBody({
    description: 'User registration payload',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'john@example.com' },
        password: { type: 'string', example: 'MyStrongPassword123!' },
        nickname: { type: 'string', example: 'Johnny' },
        username: { type: 'string', example: 'johnny_dev' },
        profilePicture: { type: 'string', example: '', nullable: true },
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
  register(@Body() userData: CreateUserDto) {
    return this.loginService.register(
      userData.email,
      userData.password,
      userData.nickname,
      userData.username,
      userData.profilePicture,
    );
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
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
