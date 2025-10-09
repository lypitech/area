import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UseFilters,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Oauth, OauthType } from './schema/Oauth.schema';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

@Injectable()
export class OauthService {
  constructor(
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    @Inject(Oauth) private readonly oauthModel: Model<Oauth>,
  ) {}

  async remove(uuid: string): Promise<Oauth | null> {
    const removed: Oauth | null = await this.oauthModel
      .findOneAndDelete({ uuid })
      .exec();

    if (!removed) {
      throw new HttpException(
        `No Oauth Token with uuid ${uuid}`,
        HttpStatus.NOT_FOUND,
      );
    }
    this.userService.removeOauthTokenByUUID(uuid);
    return removed;
  }

  private async addToken(user_uuid: string, token_data: OauthType) {
    const token: Oauth = await this.oauthModel.create({
      service_name: token_data.service_name,
      token: token_data.token,
      refresh_token: token_data.refresh_token,
      token_type: token_data.token_type,
      expires_at: token_data.expires_at,
    });
    this.userService.createOauthToken(user_uuid, token.uuid);
    return token;
  }

  @UseFilters(new HttpExceptionFilter())
  async getGithubToken(code: string, uuid: string) {
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

    const userResponse = await firstValueFrom(
      this.httpService.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      }),
    );
    const user = userResponse.data;

    await this.userService.update(uuid, { githubToken: accessToken });

    return { user, accessToken };
  }
}
