import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ServiceService } from './service.service';
import type { ServiceType } from './schemas/service.schema';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  getAll() {
    return this.serviceService.getAll();
  }

  @Get(':uuid')
  getByUUID(@Param('uuid') uuid: string) {
    return this.serviceService.getByUUID(uuid);
  }
}
