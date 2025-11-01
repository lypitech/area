import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { Response, Request } from 'express';
import { InteractionResponseType, InteractionType } from 'discord-interactions';
import { UtilsService } from './response/utils.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly utils: UtilsService,
  ) {}

  @Get('ping')
  ping() {
    return 'pong';
  }

  @Get()
  Test(@Body() body: { template: string; payload: string }) {
    return this.utils.getResult(body.template, body.payload);
  }

  // This is needed to set the `Interaction Endpoint URL`
  @Post('discord')
  discordEndpoint(@Req() req: Request, @Res() res: Response) {
    const { type } = req.body;

    if (type === InteractionType.PING) {
      return res.send({ type: InteractionResponseType.PONG });
    }
    return res.status(400).json({ error: 'unknown interaction type' });
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('about.json')
  async getAbout(@Req() request) {
    return this.appService.getAbout(request);
  }
}
