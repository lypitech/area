import { IsNotEmpty } from 'class-validator';

export class TwitchOauthCreationDto {
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  uuid: string;
}
