import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OauthService } from './oauth.service';
import { GithubOauthCreationDto } from './types/githubOauthCreationDto';

@Controller('oauth')
export class OauthController {
  constructor(private readonly authService: OauthService) {}

  @Post('github')
  @UsePipes(new ValidationPipe())
  async githubAuth(@Body() data: GithubOauthCreationDto) {
    return this.authService.getGithubToken(data.code, data.uuid);
  }
}
