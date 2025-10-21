import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ActionService } from './list/action/action.service';
import { ReactionService } from './list/reaction/reaction.service';
import { ServiceService } from './list/service.service';

@Injectable()
export class AppService {
  constructor(
    private readonly actionService: ActionService,
    private readonly reactionService: ReactionService,
    private readonly serviceService: ServiceService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getAbout(request: Request) {
    const currentTime = Math.floor(Date.now() / 1000);
    const services = await this.serviceService.getAll();
    const actions = await this.actionService.getAll();
    const reactions = await this.reactionService.getAll();
    let clientIp = request.ip ?? '0.0.0.0';

    if (clientIp.startsWith('::ffff:')) {
      clientIp = clientIp.replace('::ffff:', '');
    }
    const formattedServices = services.map((service: any) => ({
      name: service.name,
      actions: actions
        .filter((a: any) => a.service_name === service.name)
        .map((a: any) => ({
          name: a.name,
          description: a.description,
        })),
      reactions: reactions
        .filter((r: any) => r.service_name === service.name)
        .map((r: any) => ({
          name: r.name,
          description: r.description,
        })),
    }));
    return {
      client: {
        host: clientIp,
      },
      server: {
        current_time: currentTime,
        services: formattedServices,
      },
    };
  }
}
