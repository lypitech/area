import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Area } from './schemas/area.schema';
import { Trigger } from 'src/trigger/schemas/trigger.schema';
import { ReactionInstance } from 'src/response/schemas/response.schema';
import { OauthService } from 'src/oauth/oauth.service';
import { UserService } from 'src/user/user.service';
import { AreaCreationDto } from './types/areaCreationDto';

@Injectable()
export class AreaService {
  constructor(
    @InjectModel(Area.name) private areaModel: Model<Area>,
    @InjectModel(Trigger.name) private readonly triggerModel: Model<Trigger>,
    @InjectModel(ReactionInstance.name)
    private readonly responseModel: Model<ReactionInstance>,
    private readonly userService: UserService,
    private readonly oauthService: OauthService,
  ) {}

  findByUUID(
    uuid: string,
    user_uuid: string | null = null,
  ): Promise<Area | null> {
    if (user_uuid) {
      return this.areaModel.findOne({ uuid: uuid, user_uuid: user_uuid });
    }
    return this.areaModel.findOne({ uuid }).exec();
  }

  findByActionUuid(action_uuid: string): Promise<Area[]> {
    return this.areaModel.find({ action_uuid }).lean().exec();
  }

  findAll(user_uuid: string | null = null): Promise<Area[]> {
    if (user_uuid) {
      return this.areaModel.find({ user_uuid: user_uuid }).lean().exec();
    }
    return this.areaModel.find().exec();
  }

  async findTrigger(uuid: string, user_uuid: string | null) {
    const area = await this.findByUUID(uuid, user_uuid);
    if (!area) {
      throw new NotFoundException(`No area with uuid ${uuid}.`);
    }
    return this.triggerModel.find({ uuid: area.trigger_uuid });
  }

  async findResponse(uuid: string, user_uuid: string | null) {
    const area = await this.findByUUID(uuid, user_uuid);
    if (!area) {
      throw new NotFoundException(`No area with uuid ${uuid}.`);
    }
    return this.responseModel.find({ uuid: area.response_uuid });
  }

  findEnabledByTriggerUUID(trigger_uuid: string) {
    const now = new Date();
    return this.areaModel
      .find({
        trigger_uuid: trigger_uuid,
        enabled: true,
        $or: [{ disabled_until: null }, { disabled_until: { $lte: now } }],
      })
      .lean()
      .exec();
  }

  async create(dto: AreaCreationDto) {
    const user = await this.userService.findByUUID(dto.user_uuid);
    let triggerToken: string = '';
    let responseToken: string = '';

    for (const oauth_uuid of user.oauth_uuids) {
      const oauth = await this.oauthService.findByUUID(oauth_uuid);
      if (!responseToken && oauth.service_name == dto.response.service_name) {
        responseToken = oauth.token;
      }
      if (!triggerToken && oauth.service_name == dto.trigger.service_name) {
        triggerToken = oauth.token;
      }
    }
    if (!responseToken && !dto.response.oauth_token) {
      throw new NotFoundException(
        `No auth token for ${dto.response.service_name}`,
      );
    }
    if (!triggerToken && !dto.trigger.oauth_token) {
      throw new NotFoundException(
        `No auth token for ${dto.trigger.service_name}`,
      );
    }
    const response_uuid = await this.responseModel.create({
      service_name: dto.response.service_name,
      name: dto.response.name,
      description: dto.response.description ?? null,
      oauth_token: responseToken ?? dto.response.oauth_token,
      resource_id: dto.response.resource_id,
      payload: dto.response.payload,
    });
    const trigger_uuid = await this.triggerModel.create({
      service_name: dto.trigger.service_name,
      name: dto.trigger.name,
      description: dto.response.description ?? null,
      oauth_token: triggerToken ?? dto.trigger.oauth_token,
      trigger_type: dto.trigger.trigger_type ?? 'webhook',
      input: dto.trigger.input,
    });
    return this.areaModel.create({
      trigger_uuid: trigger_uuid.uuid,
      response_uuid: response_uuid.uuid,
      user_uuid: dto.user_uuid,
      name: dto.name,
      description: dto.description ?? null,
      enabled: dto.enabled,
      disabled_until: dto.disabled_until ?? null,
      history: [],
    });
  }

  async appendHistory(area_uuid: string, status: string) {
    const timestamp = new Date().toISOString();
    await this.areaModel.updateOne(
      { uuid: area_uuid },
      { $push: { history: { timestamp, status } } },
    );
  }

  async remove(uuid: string): Promise<boolean> {
    const result = await this.areaModel.deleteOne({ uuid });
    if (!result) {
      throw new NotFoundException(`No area with uuid ${uuid}.`);
    }
    return result.deletedCount === 1;
  }
}
