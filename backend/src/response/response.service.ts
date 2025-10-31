import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReactionInstance } from './schemas/response.schema';
import { DiscordReactionService } from './services/Discord/discord.service';
import { DispatchFunction } from './types/dispatchFunction';
import { ResponseDriver } from './services/contracts/response-driver';
import { DiscordResponseDriver } from './services/Discord/discord.driver';
import { ResponseCreationDto } from 'src/area/types/areaCreationDto';

@Injectable()
export class ResponseService {
  private readonly dispatchers = new Map<string, DispatchFunction>();
  private readonly drivers: ResponseDriver[] = [];
  constructor(
    @InjectModel(ReactionInstance.name)
    @Inject(DiscordReactionService)
    private responseModel: Model<ReactionInstance>,
    private readonly discordDriver: DiscordResponseDriver,
  ) {
    this.drivers = [this.discordDriver];
    this.dispatchers.set('Discord', (reaction, payload) => {
      return this.discordDriver.dispatch(reaction, payload);
    });
  }

  private getDriverFor(
    response: ResponseCreationDto,
  ): ResponseDriver | undefined {
    return this.drivers.find((d) => d.supports(response));
  }

  remove(uuid: string) {
    return this.responseModel.deleteOne({ uuid });
  }

  findAll() {
    return this.responseModel.find();
  }

  async create(data: ResponseCreationDto) {
    const driver = this.getDriverFor(data);
    await driver?.onCreate?.(data);
    const response: ReactionInstance = await this.responseModel.create(data);
    return response.uuid;
  }

  async findByUUID(uuid: string): Promise<ReactionInstance | null> {
    const response: ReactionInstance | null = await this.responseModel.findOne({
      uuid,
    });
    if (!response) {
      throw new NotFoundException(`No Response with uuid ${uuid}`);
    }
    return response;
  }

  dispatch(reaction: ReactionInstance, action_payload: Record<string, any>) {
    const dispatcher = this.dispatchers.get(reaction.service_name);
    if (!dispatcher) {
      throw new NotFoundException(
        `No dispatcher for ${reaction.service_name}.`,
      );
    }
    return dispatcher(reaction, action_payload);
  }
}
