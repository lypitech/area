import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ListService } from './list.service';
import type { ReactionListType } from './schemas/reactionList.schema';

@Controller('list/service')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get()
  getAll() {
    return this.listService.getAll();
  }

  @Get(':uuid')
  getByUUID(@Param('uuid') uuid: string) {
    return this.listService.getByUUID(uuid);
  }

  @Post()
  create(@Body() body: string) {
    return this.listService.create(body);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.listService.remove(uuid);
  }
}
