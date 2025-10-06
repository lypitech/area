import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ReactionService } from './reaction.service';

@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionsService: ReactionService) {}

  @Get()
  getAll() {
    return this.reactionsService.getAll();
  }

  @Get(':uuid')
  getByUUID(@Param('uuid') uuid: string) {
    return this.reactionsService.getByUUID(uuid);
  }

  @Post()
  create(@Body() body: any) {
    return this.reactionsService.create(body);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.reactionsService.remove(uuid);
  }
}
