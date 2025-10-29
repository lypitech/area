import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OauthService } from './oauth.service';
import { GithubOauthCreationDto } from './types/githubOauthCreationDto';
import { TwitchOauthCreationDto } from './types/twitchOauthCreationDto';


@Controller('oauth')
export class OauthController {
  constructor(private readonly authService: OauthService) {}

  @Post('github')
  @UsePipes(new ValidationPipe())
  async githubAuth(@Body() data: GithubOauthCreationDto) {
    return this.authService.getGithubToken(data.code, data.uuid);
  }

  @Post('twitch')
  @UsePipes(new ValidationPipe())
  async twitchAuth(@Body() data: TwitchOauthCreationDto) {
    return this.authService.getTwitchToken(data.code, data.uuid);
  }
}
