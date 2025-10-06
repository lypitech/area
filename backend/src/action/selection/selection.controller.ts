import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import type { ActionSelectionType } from '../schemas/actionSelection.schema';
import { ActionSelectionService } from './selection.service';

@Controller('action/list')
export class SelectionController {
  constructor(private readonly selectionService: ActionSelectionService) {}

  @Get()
  getAll() {
    return this.selectionService.getAll();
  }

  @Get(':uuid')
  getByUUID(@Param('uuid') uuid: string) {
    return this.selectionService.getByUUID(uuid);
  }

  @Post()
  create(@Body() body: ActionSelectionType) {
    return this.selectionService.create(body);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.selectionService.remove(uuid);
  }
}
