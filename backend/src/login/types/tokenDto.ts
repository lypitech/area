import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsJWT()
  @IsNotEmpty()
  refresh_token: string;
}

export class AccessTokenDto {
  @IsJWT()
  @IsNotEmpty()
  access_token: string;
}
