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

  @Get(':uuid')
  getByUUID(@Param('uuid') uuid: string) {
    return this.actionsService.getByUUID(uuid);
  }

  @Post()
  create(@Body() body: Partial<Action>) {
    return this.actionsService.createAction(body);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.actionsService.remove(uuid);
  }
}
