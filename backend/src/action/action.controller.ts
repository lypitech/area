import type { ActionSelectionType } from './schemas/actionSelection.schema';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ActionService } from './action.service';
import { Action } from './schemas/action.schemas';

@Controller('actions')
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
  create(@Body() body: Partial<Action>) {
    return this.actionService.createAction(body);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.actionService.remove(uuid);
  }

  @Get('selection')
  getAllSelection() {
    return this.actionService.getAllSelection();
  }

  @Get('selection/:uuid')
  getSelectionByUUID(@Param('uuid') uuid: string) {
    return this.actionService.getSelectionByUUID(uuid);
  }

  @Post()
  createSelection(@Body() body: ActionSelectionType) {
    return this.actionService.createActionSelection(body);
  }

  @Delete(':uuid')
  removeSelection(@Param('uuid') uuid: string) {
    return this.actionService.removeSelection(uuid);
  }

}
