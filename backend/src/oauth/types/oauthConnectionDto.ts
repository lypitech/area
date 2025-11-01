import { IsBoolean, IsNotEmpty } from 'class-validator';

export class OauthConnectionDto {
  @IsNotEmpty()
  code: string;
  @IsBoolean()
  front: boolean;
}
