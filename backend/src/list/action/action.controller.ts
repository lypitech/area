import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ActionService } from './action.service';
import type { ActionType } from '../schemas/action.schema';

@Controller('list/actions')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Get()
  getAll() {
    return this.actionService.getAll();
  }

  @Get(':uuid')
  getByUUID(@Param('uuid') uuid: string) {
    return this.actionService.getByUUID(uuid);
  }

  @Post()
  create(@Body() body: ActionType) {
    return this.actionService.create(body);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.actionService.remove(uuid);
  }
}
