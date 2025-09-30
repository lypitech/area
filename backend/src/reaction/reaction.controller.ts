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
    return this.reactionsService.findAll();
  }

  @Get(':uuid')
  getByUUID(@Param('uuid') uuid: string) {
    return this.reactionsService.findById(uuid);
  }

  @Post()
  create(@Body() body: any) {
    return this.reactionsService.create(body);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.reactionsService.delete(uuid);
  }
}
