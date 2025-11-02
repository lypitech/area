import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaCreationDto } from './types/areaCreationDto';

@Controller('areas')
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

  @Get('areas')
  getByActionUuid(@Param('action_uuid') action_uuid: string) {
    return this.areaService.findByActionUuid(action_uuid);
  }

  @Patch(':uuid/history')
  appendHistory(@Param('uuid') uuid: string, @Body() body: { status: string }) {
    return this.areaService.appendHistory(uuid, body?.status);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  create(
    @Body()
    body: AreaCreationDto,
  ) {
    return this.areaService.create(body);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.areaService.remove(uuid);
  }
}
