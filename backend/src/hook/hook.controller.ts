import { Controller, Post, Body, Param } from '@nestjs/common';
import { HookService } from './hook.service';
import { ActionService } from '../action/action.service';
import { UserService } from '../user/user.service';
import { AreaService } from 'src/area/area.service';

@Controller('hooks/github')
export class HookController {
  constructor(
    private readonly hookService: HookService,
    private readonly actionService: ActionService,
    private readonly userService: UserService,
    private readonly areaService: AreaService,
  ) {}

  @Post(':actionId')
  async handleGithubWebhook(
    @Param('actionId') actionId: string,
    @Body() payload: any,
  ) {
    const action = await this.actionService.getByUUID(actionId);
    if (!action) {
      throw new Error('Action not found');
    }
    const area = await this.areaService.findByUUID(action.area_uuid);
    if (!area) {
      throw new Error('Area not found for this action');
    }
    const user = await this.userService.findByUUID(area.user_uuid);
    return this.hookService.handleGithubWebhook(payload, actionId, user);
  }
}
