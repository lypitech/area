import { Controller, Post, Body } from '@nestjs/common';
import { OauthService } from './oauth.service';

@Controller('oauth')
export class OauthController {
  constructor(private readonly authService: OauthService) {}

  @Post('github')
  async githubAuth(@Body('code') code: string, @Body('uuid') uuid: string) {
    return this.authService.getGithubToken(code, uuid);
  }
}
