import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ListService } from './list.service';
import type { ServiceListType } from './schemas/serviceList.schema';

@Controller('services')
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
  create(@Body() body: ServiceListType) {
    return this.listService.create(body);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.listService.remove(uuid);
  }
}
