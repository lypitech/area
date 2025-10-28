import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class TriggerCreationDto {
  @IsNotEmpty()
  service_name: string;

  @IsNotEmpty()
  name: string;

  description: string | null;

  @IsObject()
  input: Record<string, any>;

  oauth_token: string | null;

  trigger_type: string | null;
}

class ResponseCreationDto {
  @IsNotEmpty()
  service_name: string;

  @IsNotEmpty()
  name: string;

  description: string | null;
  @IsArray()
  resource_ids: string[];
  oauth_token: string | null;

  @IsNotEmpty()
  payload: string;
}

export class AreaCreationDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TriggerCreationDto)
  trigger: TriggerCreationDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ResponseCreationDto)
  response: ResponseCreationDto;

  @IsNotEmpty()
  user_uuid: string;

  @IsNotEmpty()
  name: string;

  description: string | null;
  enabled: boolean;
  disabled_until: Date | null;
}
