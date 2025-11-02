import { Exclude, Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  uuid: string;

  @Expose()
  nickname: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  profilePicture: string;

  @Expose()
  refreshToken: string;

  @Expose()
  oauth_uuids!: { service_name: string; token_uuid: string }[];

  @Exclude()
  password?: string;
}
