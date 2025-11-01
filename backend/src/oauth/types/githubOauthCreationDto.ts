import { IsNotEmpty } from 'class-validator';

export class GithubOauthCreationDto {
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  front: boolean;

  @IsNotEmpty()
  uuid: string;
}
