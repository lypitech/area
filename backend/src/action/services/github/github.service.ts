import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../user/schemas/user.schema';
import axios from 'axios';

@Injectable()
export class GithubService {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async configureWebhook(parameters: {
    repo: string;
    owner: string;
    userId: string;
    actionId: string;
  }) {
    const { repo, owner, userId, actionId } = parameters;

    const user = await this.userModel.findById(userId);
    if (!user || !user.githubToken) {
      throw new UnauthorizedException('GitHub authentication required');
    }

    const baseUrl =
      this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
    const callbackUrl = `${baseUrl}/hooks/github/${actionId}`;

    const data = {
      name: 'web',
      active: true,
      events: ['push'],
      config: {
        url: callbackUrl,
        content_type: 'json',
      },
    };

    const headers = {
      Authorization: `Bearer ${user.githubToken}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post(
        `https://api.github.com/repos/${owner}/${repo}/hooks`,
        data,
        { headers },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to configure GitHub webhook: ${error.message}`);
    }
  }
}
