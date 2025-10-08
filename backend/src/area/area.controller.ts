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

  @Get('action/:action_uuid')
  getByActionUuid(@Param('action_uuid') action_uuid: string) {
    return this.areaService.findByActionUuid(action_uuid);
  }

  @Get(':uuid')
  getByUUID(@Param('uuid') uuid: string) {
    return this.areaService.findByUUID(uuid);
  }

  @Patch(':uuid/history')
  appendHistory(@Param('uuid') uuid: string, @Body() body: { status: string }) {
    return this.areaService.appendHistory(uuid, body?.status);
  }

  @Post()
  create(
    @Body()
    body: {
      action_uuid: string;
      reaction_uuid: string;
      user_uuid: string;
      name: string;
      description?: string;
      enable?: boolean;
      disabled_until?: Date | null;
    },
  ) {
    return this.areaService.create(body);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.areaService.deleteByUUID(uuid);
  }
}
