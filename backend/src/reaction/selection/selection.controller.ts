import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import type { ReactionSelectionType } from '../schemas/reactionSelection.schema';
import { SelectionService } from './selection.service';

@Controller('reaction/list')
export class SelectionController {
  constructor(private readonly selectionService: SelectionService) {}

  @Get()
  getAll() {
    return this.selectionService.getAll();
  }

  @Get(':uuid')
  getByUUID(@Param('uuid') uuid: string) {
    return this.selectionService.getByUUID(uuid);
  }

  @Post()
  create(@Body() body: ReactionSelectionType) {
    return this.selectionService.create(body);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.selectionService.remove(uuid);
  }
}
