import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ReactionsService } from './reaction.service';

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Get()
  getAll() {
    return this.reactionsService.getAll();
  }

  @Get(':uuid')
  getByUUID(@Param('uuid') uuid: string) {
    return this.reactionsService.getByUUID(uuid);
  }

  @Post()
  create(@Body() body: any) {
    return this.reactionsService.create(body);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.reactionsService.delete(uuid);
  }
}
