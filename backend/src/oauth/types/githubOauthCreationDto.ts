import { IsNotEmpty } from 'class-validator';

export class GithubOauthCreationDto {
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  uuid: string;
}
