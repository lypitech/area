import {
  Controller,
  Delete,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
  Patch,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AreaService } from '../area/area.service';
import { UserDto } from './types/userDto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly areaService: AreaService,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  getAll() {
    return this.userService.findAll();
  }

  @Get(':uuid')
  @UsePipes(new ValidationPipe({ whitelist: true }))
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

  @Delete(':uuid/areas/:area_uuid')
  removeArea(@Param('area_uuid') area_uuid: string) {
    return this.areaService.remove(area_uuid);
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
    return this.areaService.findResponse(area_uuid, uuid);
  }

  @Get('getuser/:refreshtoken')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  getUser(@Param('refreshtoken') refreshtoken: string) {
    return this.userService.findUserByRefreshToken(refreshtoken);
  }

  @Patch(':uuid')
  async updateUser(
    @Param('uuid') uuid: string,
    @Body() userDto: Partial<UserDto>,
  ): Promise<string> {
    return this.userService.updateUser(uuid, userDto);
  }

  @Delete(':uuid/:service')
  removeOauthToken(
    @Param('uuid') uuid: string,
    @Param('service') service: string,
  ) {
    return this.userService.removeOauthTokenByService(uuid, service);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.userService.remove(uuid);
  }
}
