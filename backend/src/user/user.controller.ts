import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { AreaService } from '../area/area.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly areaService: AreaService,
  ) {}

  @Get()
  getAll() {
    return this.userService.findAll();
  }

  @Get(':uuid')
  getByUUID(@Param('uuid') uuid: string) {
    return this.userService.findByUUID(uuid);
  }

  @Get(':uuid/areas')
  getUserAreas(@Param('uuid') uuid: string) {
    return this.areaService.findAll(uuid);
  }

  @Get(':uuid/areas/:area_uuid')
  getUserAreaByUUID(
    @Param('uuid') uuid: string,
    @Param('area_uuid') area_uuid: string,
  ) {
    return this.areaService.findByUUID(area_uuid, uuid);
  }

  @Get(':uuid/areas/:area_uuid/trigger')
  getTriggerFromArea(
    @Param('uuid') uuid: string,
    @Param('area_uuid') area_uuid: string,
  ) {
    return this.areaService.findTrigger(area_uuid, uuid);
  }

  @Get(':uuid/areas/:area_uuid/response')
  getResponseFromArea(
    @Param('uuid') uuid: string,
    @Param('area_uuid') area_uuid: string,
  ) {
    return this.areaService.findResponse(uuid, area_uuid);
  }

  @Get('getuser/:refreshtoken')
  getUser(@Param('refreshtoken') refreshtoken: string) {
    return this.userService.findUserByRefreshToken(refreshtoken);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.userService.remove(uuid);
  }
}
