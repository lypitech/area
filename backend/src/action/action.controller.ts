import { Controller, Get, Post, Body } from '@nestjs/common';
import { ActionService } from './action.service';

@Controller('action')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Get()
  findAll() {
    return this.actionService.findAll();
  }

  @Post()
  createAction(@Body() payload: any) {
    console.log(JSON.stringify(payload, null, 2));
    return this.actionService.createAction(payload);
  }
}
