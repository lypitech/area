import { IsIn, IsNotEmpty } from 'class-validator';
import type { OauthClient } from './oauthClient';

export class GithubOauthCreationDto {
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  uuid: string;

  @IsIn(['web', 'mobile'])
  client: OauthClient;
}
