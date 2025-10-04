import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Headers,
} from '@nestjs/common';
import type { ActionSelectionType } from './schemas/actionSelection.schema';
import { ActionService } from './action.service';
import { Action } from './schemas/action.schema';

@Controller('actions')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Get()
  getAll() {
    return this.actionService.getAll();
  }

  @Get('selection')
  getAllSelection() {
    return this.actionService.getAllSelection();
  }

  @Get('selection/:uuid')
  getSelectionByUUID(@Param('uuid') uuid: string) {
    return this.actionService.getSelectionByUUID(uuid);
  }

  @Post('selection')
  createSelection(@Body() body: ActionSelectionType) {
    return this.actionService.createActionSelection(body);
  }

  @Delete('selection/:uuid')
  removeSelection(@Param('uuid') uuid: string) {
    return this.actionService.removeSelection(uuid);
  }

  @Get(':uuid')
  getByUUID(@Param('uuid') uuid: string) {
    return this.actionService.getByUUID(uuid);
  }

  @Post()
  async create(@Body() body: { action: Partial<Action>; parameters: any }) {
    const { action, parameters } = body;
    return this.actionService.createActionWithWebhook(action, parameters);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.actionService.remove(uuid);
  }

  @Post(':uuid/fire')
  async fire(
    @Param('uuid') uuid: string,
    @Headers('x-action-token') token: string,
    @Body() payload: any,
  ) {
    return this.actionService.fire(uuid, token, payload);
  }
}
