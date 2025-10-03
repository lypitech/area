import type { ReactionSelectionType } from './schemas/reactionSelection.schema';
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

  @Get('selection')
  getAllSelection() {
    return this.reactionsService.getAllSelection();
  }

  @Get('selection/:uuid')
  getSelectionByUUID(@Param('uuid') uuid: string) {
    return this.reactionsService.getSelectionByUUID(uuid);
  }

  @Post('selection')
  createSelection(@Body() body: ReactionSelectionType) {
    return this.reactionsService.createSelection(body);
  }

  @Delete('selection/:uuid')
  removeSelection(@Param('uuid') uuid: string) {
    return this.reactionsService.removeSelection(uuid);
  }
}
