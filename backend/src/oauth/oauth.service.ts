import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Oauth, OauthType } from './schema/Oauth.schema';
import { DeleteResult, Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';

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

  private async addToken(user_uuid: string, token_data: OauthType) {
    const token: Oauth = await this.oauthModel.create({
      service_name: token_data.service_name,
      token: token_data.token,
      refresh_token: token_data.refresh_token,
      token_type: token_data.token_type,
      expires_at: token_data.expires_at,
    });
    await this.userService.addOauthToken(user_uuid, token.uuid);
    return token;
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

  async remove(uuid: string): Promise<boolean> {
    const deleted: DeleteResult = await this.oauthModel.deleteOne({ uuid });
    if (!deleted) {
      throw new NotFoundException(`No oauth with uuid ${uuid}.`);
    }
    return deleted.deletedCount === 1;
  }
}
