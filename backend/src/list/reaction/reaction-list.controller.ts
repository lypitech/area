import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import type { ReactionListType } from 'src/list/schemas/reactionList.schema';
import { ReactionListService } from './reaction-list.service';

@Controller('list/reaction')
export class ReactionListController {
  constructor(private readonly reactionList: ReactionListService) {}

  @Get()
  getAll() {
    return this.reactionList.getAll();
  }

  @Get(':uuid')
  getByUUID(@Param('uuid') uuid: string) {
    return this.reactionList.getByUUID(uuid);
  }

  @Post()
  create(@Body() body: ReactionListType) {
    return this.reactionList.create(body);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.reactionList.remove(uuid);
  }
}
