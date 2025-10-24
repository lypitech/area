import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { User } from 'src/user/schemas/user.schema';
import { Oauth } from 'src/oauth/schema/Oauth.schema';

@Injectable()
export class GithubService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Oauth.name) private readonly oauthModel: Model<Oauth>,
  ) {}

  async configureWebhook(parameters: {
    repo: string;
    owner: string;
    userId: string;
    actionId: string;
    actionToken: string;
  }): Promise<{ id?: number; raw?: any }> {
    const { repo, owner, userId, actionId, actionToken } = parameters;

    const user = await this.userModel.findOne({ uuid: userId });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const githubOauth: Oauth | null = await this.oauthModel.findOne({
      uuid: { $in: user.oauth_uuids ?? [] },
      service_name: 'github',
    });

    if (!githubOauth?.token) {
      throw new UnauthorizedException('GitHub authentication required');
    }

    const baseUrl =
      this.configService.get<string>('BASE_URL') || 'http://localhost:8080';
    const callbackUrl = `${baseUrl.replace(/\/$/, '')}/hooks/github/${encodeURIComponent(
      actionId,
    )}?token=${encodeURIComponent(actionToken)}`;

    const data = {
      name: 'web',
      active: true,
      events: ['push'],
      config: {
        url: callbackUrl,
        content_type: 'json',
        secret: actionToken,
      },
    };

    const headers = {
      Authorization: `token ${githubOauth.token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
    };

    try {
      const response = await axios.post(
        `https://api.github.com/repos/${owner}/${repo}/hooks`,
        data,
        { headers },
      );
      return { id: response.data?.id, raw: response.data };
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        'unknown GitHub error';
      throw new HttpException(
        `Failed to configure GitHub webhook: ${message}`,
        error?.response?.status ?? HttpStatus.UNAUTHORIZED,
      );
    }
  }

  /**
   * Supprime un webhook par id
   */
  async deleteWebhook(parameters: {
    owner: string;
    repo: string;
    userId: string;
    hookId: number;
  }): Promise<void> {
    const { owner, repo, userId, hookId } = parameters;

    const user = await this.userModel.findOne({ uuid: userId });
    if (!user || !(user as any).githubToken) {
      throw new UnauthorizedException('GitHub authentication required');
    }

    const headers = {
      Authorization: `token ${(user as any).githubToken}`,
      Accept: 'application/vnd.github+json',
    };

    await axios.delete(
      `https://api.github.com/repos/${owner}/${repo}/hooks/${hookId}`,
      {
        headers,
      },
    );
  }
}
