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
import { User, UserOauthLink } from '../user/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../user/types/userDto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class OauthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Oauth.name) private readonly oauthModel: Model<Oauth>,
  ) {}

  private async addToUser(
    user_uuid: string,
    token_uuid: string,
    service_name: string,
  ): Promise<User> {
    const updated: User | null = await this.userModel.findOneAndUpdate(
      { uuid: user_uuid },
      { $push: { oauth_uuids: { service_name, token_uuid } } },
      { new: true },
    );
    if (!updated) {
      throw new NotFoundException('Invalid user uuid');
    }
    return updated;
  }

  private async createUser(
    email: string,
    password: string,
    nickname: string,
    username: string,
    profilePicture: string,
    oauthsLinks: UserOauthLink[],
  ) {
    const created = await new this.userModel({
      email: email,
      password: await bcrypt.hash(password, 10),
      nickname: nickname,
      username: username,
      profilePicture: profilePicture,
      oauth_uuids: oauthsLinks,
    }).save();
    return plainToInstance(UserDto, created.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  private async createJwt(oauth_uuid: string) {
    const user: User | null = await this.userModel.findOne({
      'oauth_uuids.token_uuid': oauth_uuid,
    });
    if (!user) throw new BadRequestException('No user found.');
    const payload = { sub: user.uuid, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
    });

    await this.userModel.findOneAndUpdate(
      { uuid: user.uuid },
      { refreshToken: await bcrypt.hash(refreshToken, 10) },
    );
    return {
      uuid: user.uuid,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private async getTokensFromUser(uuid: string) {
    const user: User | null = await this.userModel.findOne({ uuid });
    if (!user) throw new BadRequestException('No user found.');
    return user.oauth_uuids;
  }

  async findByUUID(uuid: string): Promise<Oauth> {
    const oauth: Oauth | null = await this.oauthModel.findOne({ uuid: uuid });
    if (!oauth) {
      throw new NotFoundException(`No user with uuid ${uuid} found.`);
    }
    return oauth;
  }

  private async fetchImageAsBase64(url: string): Promise<string> {
    const response = await firstValueFrom(
      this.httpService.get(url, {
        responseType: 'arraybuffer',
      }),
    );

    return Buffer.from(response.data, 'binary').toString('base64');
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
    await this.addToUser(user_uuid, token.uuid, data.service_name);
    return token;
  }

  private async updateToken(user_uuid: string, data: OauthDto) {
    const tokens = await this.getTokensFromUser(user_uuid);
    for (const oauth of tokens) {
      if (oauth.service_name === data.service_name) {
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
    const tokens = await this.getTokensFromUser(user_uuid);

    const wanted = service_name.toLowerCase();
    const link = tokens.find((o) => o.service_name.toLowerCase() === wanted);
    if (!link) return null;

    return this.oauthModel.findOne({ uuid: link.token_uuid });
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

  async loginWithGithub(code: string, front: boolean) {
    try {
      const token = await this.getGithubToken(code, front);
      const newData = await this.getGithubUserInfos(<OauthDto>token);
      const oauth: Oauth | null = await this.findByMetaMember(
        'github_id',
        newData.id,
      );
      if (!oauth)
        throw new BadRequestException('User has never connected with Github');
      return this.createJwt(oauth.uuid);
    } catch (e: any) {
      throw new BadRequestException(`Error: ${e.message}`);
    }
  }

  async registerWithGithub(code: string, front: boolean) {
    try {
      const token = await this.getGithubToken(code, front);
      const userData = await this.getGithubUserInfos(<OauthDto>token);
      const oauth: Oauth | null = await this.findByMetaMember(
        'github_id',
        userData.id,
      );
      if (oauth) throw new BadRequestException('User has already registered');
      token.meta = { github_id: userData.id, ...token.meta };
      const created: Oauth = await this.oauthModel.create({
        service_name: token.service_name,
        token: token.token,
        refresh_token: token.refresh_token,
        token_type: token.token_type,
        expires_at: token.expires_at,
        meta: token.meta,
      });
      return this.createUser(
        userData.email,
        '',
        userData.name,
        userData.log,
        await this.fetchImageAsBase64(userData.avatar_url),
        [{ service_name: created.service_name, token_uuid: created.uuid }],
      );
    } catch (e: any) {
      throw new BadRequestException(`Error: ${e.message}`);
    }
  }

  async getGithubToken(code: string, front: boolean, user_uuid: string = '') {
    const clientId: string = front
      ? (process.env.GITHUB_CLIENT_ID ?? '')
      : (process.env.GITHUB_MOBILE_CLIENT_ID ?? '');
    const clientSecret: string = front
      ? (process.env.GITHUB_CLIENT_SECRET ?? '')
      : (process.env.GITHUB_MOBILE_CLIENT_SECRET ?? '');
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

  async loginWithTwitch(code: string) {
    try {
      const token = await this.getTwitchToken(code);
      const oauth: Oauth | null = await this.findByMetaMember(
        'twitch_user_id',
        token.meta?.twitch_user_id as string,
      );
      if (!oauth)
        throw new BadRequestException('User has never connected with twitch');
      return this.createJwt(oauth.uuid);
    } catch (e: any) {
      throw new BadRequestException(`Error: ${e.message}`);
    }
  }

  async registerWithTwitch(code: string) {
    try {
      const token = await this.getTwitchToken(code);
      const oauth: Oauth | null = await this.findByMetaMember(
        'twitch_user_id',
        token.meta?.twitch_user_id as string,
      );
      if (oauth) throw new BadRequestException('User has already registered');
      const created: Oauth = await this.oauthModel.create({
        service_name: token.service_name,
        token: token.token,
        refresh_token: token.refresh_token,
        token_type: token.token_type,
        expires_at: token.expires_at,
        meta: token.meta,
      });
      return this.createUser(
        token.meta?.twitch_email as string,
        '',
        token.meta?.twitch_display_name as string,
        token.meta?.twitch_login as string,
        await this.fetchImageAsBase64(token.meta?.profile_image_url as string),
        [{ service_name: created.service_name, token_uuid: created.uuid }],
      );
    } catch (e: any) {
      throw new BadRequestException(`Error: ${e.message}`);
    }
  }

  async getTwitchToken(code: string, user_uuid: string = '') {
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
    const token: OauthDto = {
      service_name: 'twitch',
      token: accessToken,
      refresh_token: tokenData.refreshToken,
      token_type: tokenData.token_type,
      expires_at: tokenData.expires_at,
      meta: {
        twitch_user_id: twitchUser.id,
        twitch_login: twitchUser.login,
        twitch_email: twitchUser.email,
        twitch_display_name: twitchUser.display_name,
        profile_image_url: twitchUser.profile_image_url,
      },
    };

    return user_uuid ? this.addToken(user_uuid, token) : token;
  }

  async remove(uuid: string) {
    const deleted: DeleteResult = await this.oauthModel.deleteOne({ uuid });
    if (!deleted) {
      throw new NotFoundException(`No oauth with uuid ${uuid}.`);
    }
    return { message: 'Oauth deleted successfully.' };
  }
}
