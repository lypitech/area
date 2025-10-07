import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Headers,
} from '@nestjs/common';
import { ActionService } from './action.service';
import { Action } from './schemas/action.schema';

@Controller('actions')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Get()
  getAll() {
    return this.actionService.getAll();
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
