import { IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class TriggerCreationDto {
  @IsNotEmpty()
  service_name: string;
  @IsNotEmpty()
  name: string;
  description: string | null;
  resource_id: string;
  input: Record<string, any>;
  oauth_token: string | null;
  trigger_type: string | null;
  every_minute: string | null;
}

class ResponseCreationDto {
  @IsNotEmpty()
  service_name: string;

  @IsNotEmpty()
  name: string;

  description: string | null;
  resource_id: string;
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
