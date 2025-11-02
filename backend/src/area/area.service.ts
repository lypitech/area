import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Area } from './schemas/area.schema';
import { TriggerType } from 'src/trigger/schemas/trigger.schema';
import { OauthService } from 'src/oauth/oauth.service';
import { ResponseService } from 'src/response/response.service';
import { AreaCreationDto } from './types/areaCreationDto';
import { TriggerService } from '../trigger/trigger.service';

@Injectable()
export class AreaService {
  private readonly noOauthRequired: string[] = ['Discord', 'Area'];
  constructor(
    @InjectModel(Area.name) private areaModel: Model<Area>,
    private readonly triggerService: TriggerService,
    private readonly responseService: ResponseService,
    private readonly oauthService: OauthService,
  ) {}

  findByUUID(
    uuid: string,
    user_uuid: string | null = null,
  ): Promise<Area | null> {
    if (user_uuid) {
      return this.areaModel.findOne({ uuid: uuid, user_uuid: user_uuid });
    }
    return this.areaModel.findOne({ uuid });
  }

  findByActionUuid(action_uuid: string): Promise<Area[]> {
    return this.areaModel.find({ action_uuid });
  }

  findAll(user_uuid: string | null = null): Promise<Area[]> {
    if (user_uuid) {
      return this.areaModel.find({ user_uuid: user_uuid });
    }
    return this.areaModel.find();
  }

  async findTrigger(uuid: string, user_uuid: string | null) {
    const area = await this.findByUUID(uuid, user_uuid);
    if (!area) {
      throw new NotFoundException(`No area with uuid ${uuid}.`);
    }
    return this.triggerService.getByUUID(area.trigger_uuid);
  }

  async findResponse(uuid: string, user_uuid: string | null) {
    const area = await this.findByUUID(uuid, user_uuid);
    if (!area) {
      throw new NotFoundException(`No area with uuid ${uuid}.`);
    }
    return this.responseService.findByUUID(area.response_uuid);
  }

  async create(dto: AreaCreationDto) {
    const triggerOauth = await this.oauthService.findByUserUUIDAndService(
      dto.user_uuid,
      dto.trigger.service_name,
    );
    const responseOauth = await this.oauthService.findByUserUUIDAndService(
      dto.user_uuid,
      dto.response.service_name,
    );

    let missing: string[] = [];
    if (
      !this.noOauthRequired.includes(dto.response.service_name) &&
      !responseOauth
    )
      missing.push(dto.response.service_name);
    if (
      !this.noOauthRequired.includes(dto.trigger.service_name) &&
      !triggerOauth
    )
      missing.push(dto.trigger.service_name);
    missing = [...new Set(missing)];
    if (missing.length > 0) {
      throw new BadRequestException(
        `Missing oauth for ${missing.join(' and ')}`,
      );
    }
    const response_uuid = await this.responseService.create({
      service_name: dto.response.service_name,
      name: dto.response.name,
      description: dto.response.description ?? '',
      oauth_token: responseOauth?.token ?? dto.response.oauth_token ?? '',
      resource_ids: dto.response.resource_ids,
      payload: dto.response.payload,
    });

    const trigger_uuid = await this.triggerService.create(
      {
        service_name: dto.trigger.service_name,
        name: dto.trigger.name,
        description: dto.response.description ?? undefined,
        oauth_token: triggerOauth?.token ?? dto.trigger.oauth_token,
        trigger_type: (dto.trigger.trigger_type as TriggerType) ?? 'webhook',
        input: dto.trigger.input,
        user_uuid: dto.user_uuid,
      },
      dto.trigger.input,
    );

    return this.areaModel.create({
      trigger_uuid: trigger_uuid,
      response_uuid: response_uuid,
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

  async enable(uuid: string) {
    const before: Area | null = await this.areaModel.findOneAndUpdate(
      { uuid },
      { $set: { enabled: true } },
    );
    if (!before) {
      throw new NotFoundException('No area found.');
    }
    return this.findByUUID(before.uuid);
  }

  async disable(uuid: string) {
    const before: Area | null = await this.areaModel.findOneAndUpdate(
      { uuid },
      { $set: { enabled: false } },
    );
    if (!before) {
      throw new NotFoundException('No area found.');
    }
    return this.findByUUID(before.uuid);
  }

  async remove(uuid: string) {
    const found = await this.findByUUID(uuid);
    if (found) {
      await this.triggerService.remove(found.trigger_uuid);
      await this.responseService.remove(found.response_uuid);
    }
    const result = await this.areaModel.deleteOne({ uuid });
    if (!result) {
      throw new NotFoundException(`No area with uuid ${uuid}.`);
    }
    return { message: 'Area deleted successfully' };
  }
}
