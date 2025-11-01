import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Oauth } from './schema/Oauth.schema';
import { DeleteResult, Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { OauthDto } from './types/oauthDto';
import { UserDto } from '../user/types/userDto';
import { User } from '../user/schemas/user.schema';
import { rethrow } from '@nestjs/core/helpers/rethrow';

@Injectable()
export class OauthService {
  constructor(
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    @InjectModel(Oauth.name) private readonly oauthModel: Model<Oauth>,
  ) {}

  async findByUUID(uuid: string): Promise<Oauth> {
    const oauth: Oauth | null = await this.oauthModel.findOne({ uuid: uuid });
    if (!oauth) {
      throw new NotFoundException(`No user with uuid ${uuid} found.`);
    }
    return oauth;
  }

  private async addToken(user_uuid: string, data: OauthDto) {
    const token: Oauth = await this.oauthModel.create({
      service_name: data.service_name,
      token: data.token,
      refresh_token: data.refresh_token,
      token_type: data.token_type,
      expires_at: data.expires_at,
      meta: data.meta,
    });
    await this.userService.addOauthToken(
      user_uuid,
      token.uuid,
      data.service_name,
    );
    return token;
  }

  private async updateToken(user_uuid: string, data: OauthDto) {
    const user = await this.userService.findByUUID(user_uuid);
    for (const oauth of user.oauth_uuids) {
      if (oauth[0] === data.service_name) {
        this.oauthModel.findOneAndUpdate({ uuid: oauth[1] }, { data });
      }
    }
  }

  private async findByMetaMember(member: string, content: string) {
    const query = { [`meta.${member}`]: content };
    return this.oauthModel.findOne(query).exec();
  }

  async findByUserUUIDAndService(
    user_uuid: string,
    service_name: string,
  ): Promise<Oauth | null> {
    const userOauths = (await this.userService.findByUUID(user_uuid))
      .oauth_uuids;
    for (const oauth of userOauths) {
      if (oauth[0] === service_name) {
        return this.oauthModel.findOne({ uuid: oauth[1] });
      }
    }
    return null;
  }

  private async getGithubUserInfos(token: OauthDto) {
    const headers = { Authorization: `${token.token_type} ${token.token}` };
    const userResponse = await firstValueFrom(
      this.httpService.get('https://api.github.com/user', { headers }),
    );
    const userData = userResponse.data;
    if (!userData.email) {
      const emailResponse = await firstValueFrom(
        this.httpService.get('https://api.github.com/user/emails', { headers }),
      );
      const emails = emailResponse.data;
      userData.email = emails.find((e) => e.primary && e.verified)?.email ?? emails[0]?.email ?? null;
    }
    return userData as Record<string, string>;
  }

  async loginWithGithub(code: string) {
    try {
      const token = await this.getGithubToken(code);
      const newData = await this.getGithubUserInfos(<OauthDto>token);
      const oauth: Oauth | null = await this.findByMetaMember(
        'github_id',
        newData.id,
      );
      if (!oauth)
        throw new BadRequestException('User has never connected with Github');
      const login = await this.userService.login(oauth.uuid);
      if (login) {
        await this.updateToken(login.uuid, <OauthDto>token);
        return login;
      }
      throw new BadRequestException('Wrong credentials.');
    } catch (e: any) {
      throw new BadRequestException(`Error: ${e.message}`);
    }
  }

  async registerWithGithub(code: string) {
    try {
      const token = await this.getGithubToken(code);
      const userData = await this.getGithubUserInfos(<OauthDto>token);
      const oauth: Oauth | null = await this.findByMetaMember(
        'github_id',
        userData.id,
      );
      if (oauth) throw new BadRequestException('User has already registered');
      const user = await this.userService.create(
        userData.email,
        '',
        userData.name,
        userData.log,
        userData.avatar_url,
      );
      token.meta = { github_id: userData.id };
      await this.addToken(user.uuid, <OauthDto>token);
      return this.userService.findByUUID(user.uuid);
    } catch (e: any) {
      throw new BadRequestException(`Error: ${e.message}`);
    }
  }

  async getGithubToken(code: string, user_uuid: string = '') {
    const tokenResponse = await firstValueFrom(
      this.httpService.post(
        'https://github.com/login/oauth/access_token',

        new URLSearchParams({
          client_id: process.env.GITHUB_CLIENT_ID ?? '',
          client_secret: process.env.GITHUB_CLIENT_SECRET ?? '',
          code,
        }).toString(),

        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );
    const tokenData = tokenResponse.data;
    const accessToken = tokenData.access_token;
    if (!accessToken) {
      throw new Error('GitHub OAuth failed: no access token returned');
    }
    const token: OauthDto = {
      service_name: 'github',
      token: accessToken,
      refresh_token: tokenData.refreshToken,
      token_type: tokenData.token_type,
      expires_at: tokenData.expires_at,
    };

    return user_uuid ? this.addToken(user_uuid, token) : token;
  }

  async getTwitchToken(code: string, user_uuid: string) {
    const tokenResponse = await firstValueFrom(
      this.httpService.post(
        'https://id.twitch.tv/oauth2/token',

        new URLSearchParams({
          client_id: process.env.TWITCH_CLIENT_ID ?? '',
          client_secret: process.env.TWITCH_CLIENT_SECRET ?? '',
          code,
          grant_type: 'authorization_code',
          redirect_uri: 'http://localhost:8081/callback',
        }).toString(),

        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );
    const tokenData = tokenResponse.data;
    const accessToken = tokenData.access_token;
    if (!accessToken) {
      throw new Error('Twitch OAuth failed: no access token returned');
    }

    const userInfoResponse = await firstValueFrom(
      this.httpService.get('https://api.twitch.tv/helix/users', {
        headers: {
          'Client-Id': process.env.TWITCH_CLIENT_ID ?? '',
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );

    const twitchUser = userInfoResponse.data?.data?.[0];
    if (!twitchUser) {
      throw new Error('Twitch OAuth failed: could not fetch user info');
    }
    const token = {
      service_name: 'twitch',
      token: accessToken,
      refresh_token: tokenData.refreshToken,
      token_type: tokenData.token_type,
      expires_at: tokenData.expires_at,
      meta: {
        twitch_user_id: twitchUser.id,
        twitch_login: twitchUser.login,
        twitch_display_name: twitchUser.display_name,
        profile_image_url: twitchUser.profile_image_url,
      },
    };

    return this.addToken(user_uuid, token);
  }

  async remove(uuid: string): Promise<boolean> {
    const deleted: DeleteResult = await this.oauthModel.deleteOne({ uuid });
    if (!deleted) {
      throw new NotFoundException(`No oauth with uuid ${uuid}.`);
    }
    return deleted.deletedCount === 1;
  }
}
