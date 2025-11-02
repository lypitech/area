import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class TriggerCreationDto {
  @IsNotEmpty()
  service_name: string;

  @IsNotEmpty()
  name: string;

  description: string | null;

  input: Record<string, any>;

  oauth_token: string | null;

  trigger_type: string | null;
}

export class ResponseCreationDto {
  @IsNotEmpty()
  service_name: string;

  @IsNotEmpty()
  name: string;

  description: string | null;
  oauth_token: string | null;
  @IsNotEmpty()
  resource_ids: Record<string, string>;
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
