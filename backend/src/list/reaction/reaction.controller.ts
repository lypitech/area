import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import type { ReactionType } from 'src/list/schemas/reaction.schema';
import { ReactionService } from './reaction.service';

@Controller('list/reactions')
export class ReactionController {
  constructor(private readonly reactionList: ReactionService) {}

  @Get()
  getAll() {
    return this.reactionList.getAll();
  }

  @Get(':uuid')
  getByUUID(@Param('uuid') uuid: string) {
    return this.reactionList.getByUUID(uuid);
  }

  @Post()
  create(@Body() body: ReactionType) {
    return this.reactionList.create(body);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.reactionList.remove(uuid);
  }
}
