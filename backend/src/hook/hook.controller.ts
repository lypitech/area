import {
  Controller,
  Post,
  Body,
  Param,
  Query,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { HookService } from './hook.service';

@Controller('hooks/github')
export class HookController {
  constructor(private readonly hookService: HookService) {}

  @Post(':actionId')
  async handleGithubWebhook(
    @Param('actionId') actionId: string,
    @Query('token') token: string | undefined,
    @Body() payload: any,
    @Headers('x-github-event') event?: string,
  ) {
    if (!token) {
      throw new UnauthorizedException('Missing action token');
    }
    return this.hookService.handleGithubWebhook(
      payload,
      actionId,
      token,
      event,
    );
  }
}
