import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AreaService } from './area.service';

@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Get()
  getAll() {
    return this.areaService.findAll();
  }

  @Get(':uuid')
  getByUUID(@Param('uuid') uuid: string) {
    return this.areaService.findByUUID(uuid);
  }

  @Patch(':uuid/history')
  pushHistory(@Param('uuid') uuid: string, @Body() body: any) {
    return this.areaService.pushHistory(uuid, body);
  }

  @Get('action/:action_uuid')
  getByActionUuid(@Param('action_uuid') action_uuid: string) {
    return this.areaService.findByActionUuid(action_uuid);
  }

  @Post()
  create(@Body() body: any) {
    return this.areaService.create(body);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.areaService.deleteByUUID(uuid);
  }
}
