import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Oauth } from './schema/Oauth.schema';
import { DeleteResult, Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { OauthDto } from './types/oauthDto';

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
    });
    await this.userService.addOauthToken(
      user_uuid,
      token.uuid,
      data.service_name,
    );
    return token;
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

  async getGithubToken(code: string, user_uuid: string) {
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
    const token = {
      service_name: 'github',
      token: accessToken,
      refresh_token: tokenData.refreshToken,
      token_type: tokenData.token_type,
      expires_at: tokenData.expires_at,
    };

    return this.addToken(user_uuid, token);
  }

  async getTwitchToken(code: string, user_uuid: string) {
    const tokenResponse = await firstValueFrom(
      this.httpService.post(
        'https://id.twitch.tv/oauth2/token',

        new URLSearchParams({
          client_id: process.env.TWITCH_CLIENT_ID ?? '',
          client_secret: process.env.TWITCH_CLIENT_SECRET ?? '',
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
      throw new Error('Twitch OAuth failed: no access token returned');
    }
    const token = {
      service_name: 'twitch',
      token: accessToken,
      refresh_token: tokenData.refreshToken,
      token_type: tokenData.token_type,
      expires_at: tokenData.expires_at,
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
