import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ActionsService } from './action.service';
import { Action } from './schemas/action.schemas';

@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Get()
  getAll() {
    return this.actionsService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.actionsService.getOne(id);
  }

  @Post()
  create(@Body() body: Partial<Action>) {
    return this.actionsService.createAction(body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.actionsService.deleteAction(id);
  }
}
