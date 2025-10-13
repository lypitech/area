import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import type { ActionListType } from 'src/list/schemas/actionList.schema';
import { ActionListService } from './action-list.service';

@Controller('list/actions')
export class ActionListController {
  constructor(private readonly actionListService: ActionListService) {}

  @Get()
  getAll() {
    return this.actionListService.getAll();
  }

  @Get(':uuid')
  getByUUID(@Param('uuid') uuid: string) {
    return this.actionListService.getByUUID(uuid);
  }

  @Post()
  create(@Body() body: ActionListType) {
    return this.actionListService.create(body);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.actionListService.remove(uuid);
  }
}
