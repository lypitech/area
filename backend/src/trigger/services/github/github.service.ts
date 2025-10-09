import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class GithubService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async configureWebhook(parameters: {
    repo: string;
    owner: string;
    userId: string;
    actionId: string;
    actionToken: string;
  }): Promise<{ id?: number; raw?: any }> {
    // const { repo, owner, userId, actionId, actionToken } = parameters;
    throw new HttpException(
      "Couldn't setup github webhook",
      HttpStatus.UNAUTHORIZED,
    );
    // const user = await this.userModel.findOne({ uuid: userId }).lean().exec();
    // if (!user || !user.githubToken) {
    //   throw new UnauthorizedException('GitHub authentication required');
    // }
    //
    // const baseUrl =
    //   this.configService.get<string>('BASE_URL') || 'http://localhost:8080';
    //
    // const callbackUrl =
    //   `${baseUrl.replace(/\/$/, '')}/hooks/github/${actionId}` +
    //   `?token=${encodeURIComponent(actionToken)}`;
    //
    // const data = {
    //   name: 'web',
    //   active: true,
    //   events: ['push'],
    //   config: {
    //     url: callbackUrl,
    //     content_type: 'json',
    //     secret: actionToken,
    //   },
    // };
    //
    // const headers = {
    //   Authorization: `token ${user.githubToken}`,
    //   'Content-Type': 'application/json',
    //   Accept: 'application/vnd.github+json',
    // };
    //
    // try {
    //   const response = await axios.post(
    //     `https://api.github.com/repos/${owner}/${repo}/hooks`,
    //     data,
    //     { headers },
    //   );
    //   return { id: response.data?.id, raw: response.data };
    // } catch (error: any) {
    //   const message =
    //     error?.response?.data?.message ??
    //     error?.message ??
    //     'unknown GitHub error';
    //   throw new Error(`Failed to configure GitHub webhook: ${message}`);
    // }
  }
}
