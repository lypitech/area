import { Controller, Get, Param } from '@nestjs/common';
import { ReactionService } from './reaction.service';

@Controller('reactions')
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
}
