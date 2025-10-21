import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping')
  ping() {
    return 'pong';
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
