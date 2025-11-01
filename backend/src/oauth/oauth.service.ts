import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Oauth } from './schema/Oauth.schema';
import { DeleteResult, Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { OauthDto } from './types/oauthDto';
import { OauthClient } from './types/oauthClient';

type Provider = 'github' | 'twitch';

@Injectable()
export class OauthService {
  constructor(
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    @InjectModel(Oauth.name) private readonly oauthModel: Model<Oauth>,
  ) {}

  async findByUUID(uuid: string): Promise<Oauth> {
    const oauth: Oauth | null = await this.oauthModel.findOne({ uuid });
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

  private getProviderCreds(provider: Provider, client: OauthClient) {
    if (provider === 'github') {
      const clientId =
        client === 'web'
          ? process.env.GITHUB_WEB_CLIENT_ID
          : process.env.GITHUB_MOBILE_CLIENT_ID;

      const clientSecret =
        client === 'web'
          ? process.env.GITHUB_WEB_CLIENT_SECRET
          : process.env.GITHUB_MOBILE_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new Error(
          `Missing GitHub ${client.toUpperCase()} client credentials`,
        );
      }
      return {
        clientId,
        clientSecret,
        redirectUri: undefined as string | undefined,
      };
    }

    const clientId =
      client === 'web'
        ? process.env.TWITCH_WEB_CLIENT_ID
        : process.env.TWITCH_MOBILE_CLIENT_ID;

    const clientSecret =
      client === 'web'
        ? process.env.TWITCH_WEB_CLIENT_SECRET
        : process.env.TWITCH_MOBILE_CLIENT_SECRET;

    const redirectUri =
      client === 'web'
        ? process.env.TWITCH_WEB_REDIRECT_URI
        : process.env.TWITCH_MOBILE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error(
        `Missing Twitch ${client.toUpperCase()} credentials or redirect URI`,
      );
    }
    return { clientId, clientSecret, redirectUri };
  }

  async getGithubToken(code: string, user_uuid: string, client: OauthClient) {
    const { clientId, clientSecret } = this.getProviderCreds('github', client);

    const tokenResponse = await firstValueFrom(
      this.httpService.post(
        'https://github.com/login/oauth/access_token',
        new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
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

    const tokenData = tokenResponse.data as {
      access_token?: string;
      token_type?: string;
      scope?: string;
      refresh_token?: string;
      expires_in?: number;
      refresh_token_expires_in?: number;
    };

    const accessToken = tokenData.access_token;
    if (!accessToken) {
      throw new Error('GitHub OAuth failed: no access token returned');
    }

    const expiresAt = tokenData.expires_in
      ? new Date(Date.now() + tokenData.expires_in * 1000)
      : undefined;

    const token: OauthDto = {
      service_name: 'github',
      token: accessToken,
      refresh_token: tokenData.refresh_token,
      token_type: tokenData.token_type ?? 'bearer',
      expires_at: expiresAt ?? null,
    } as unknown as OauthDto;

    return this.addToken(user_uuid, token);
  }

  async getTwitchToken(code: string, user_uuid: string, client: OauthClient) {
    const { clientId, clientSecret, redirectUri } = this.getProviderCreds(
      'twitch',
      client,
    );

    const tokenResponse = await firstValueFrom(
      this.httpService.post(
        'https://id.twitch.tv/oauth2/token',
        new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri!, // requis par Twitch
        }).toString(),
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );

    const tokenData = tokenResponse.data as {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number; // seconds
      token_type?: string;
      scope?: string[];
    };

    const accessToken = tokenData.access_token;
    if (!accessToken) {
      throw new Error('Twitch OAuth failed: no access token returned');
    }

    // Récupération des infos utilisateur Twitch
    const userInfoResponse = await firstValueFrom(
      this.httpService.get('https://api.twitch.tv/helix/users', {
        headers: {
          'Client-Id': clientId,
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );

    const twitchUser = userInfoResponse.data?.data?.[0];
    if (!twitchUser) {
      throw new Error('Twitch OAuth failed: could not fetch user info');
    }

    const expiresAt = tokenData.expires_in
      ? new Date(Date.now() + tokenData.expires_in * 1000)
      : null;

    const token: OauthDto = {
      service_name: 'twitch',
      token: accessToken,
      refresh_token: tokenData.refresh_token,
      token_type: tokenData.token_type ?? 'bearer',
      expires_at: expiresAt,
      meta: {
        twitch_user_id: twitchUser.id,
        twitch_login: twitchUser.login,
        twitch_display_name: twitchUser.display_name,
        profile_image_url: twitchUser.profile_image_url,
        client,
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
