import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ResponseService } from './response.service';
import { ReactionInstance, ResponseSchema } from './schemas/response.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceService } from '../list/service.service';
import { Service, ServiceSchema } from '../list/schemas/service.schema';
import { DiscordModule } from './services/Discord/discord.module';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: ReactionInstance.name, schema: ResponseSchema },
      { name: Service.name, schema: ServiceSchema },
    ]),
    DiscordModule,
  ],
  providers: [ResponseService, ServiceService],
  exports: [ResponseService],
})
export class ResponseModule {}
