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

@Controller('hooks')
export class HookController {
  constructor(private readonly hookService: HookService) {}

  @Post('github/:actionId')
  async handleGithubWebhook(
    @Param('actionId') actionId: string,
    @Query('token') token: string | undefined,
    @Body() payload: Record<string, any>,
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
