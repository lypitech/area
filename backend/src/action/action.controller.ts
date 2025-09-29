import { Body, Controller, Get, Post } from '@nestjs/common';
import { ActionsService } from './action.service';
import { Action } from './schemas/action.shemas';

@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Get()
  getAll() {
    return this.actionsService.findAll();
  }

  @Post()
  create(@Body() body: Partial<Action>) {
    return this.actionsService.createAction(body);
  }
}
