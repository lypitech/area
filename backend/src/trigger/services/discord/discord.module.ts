import { Module } from '@nestjs/common';
import { DiscordTriggerDriver } from './discord.driver';
import { ServiceModule } from 'src/list/service.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { Trigger, TriggerSchema } from 'src/trigger/schemas/trigger.schema';
import { Area, AreaSchema } from 'src/area/schemas/area.schema';
import { ResponseModule } from '../../../response/response.module';
import { DiscordTriggerService } from './discord.service';

@Module({
  imports: [
    ServiceModule,
    ResponseModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Trigger.name, schema: TriggerSchema },
      { name: Area.name, schema: AreaSchema },
    ]),
  ],
  providers: [DiscordTriggerService, DiscordTriggerDriver],
  exports: [DiscordTriggerDriver],
})
export class DiscordModule {}
