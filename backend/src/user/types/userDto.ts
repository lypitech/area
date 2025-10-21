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
  oauth_uuids: string[];

  @Exclude()
  password?: string;
}
