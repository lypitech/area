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

@Injectable()
export class GithubService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  /**
   * Crée un webhook "repository" avec PAT utilisateur (User.githubToken).
   * Évènements par défaut: push (modifiable ici).
   */
  async configureWebhook(parameters: {
    repo: string;
    owner: string;
    userId: string; // uuid dans votre DB
    actionId: string; // utilisé pour l’URL callback
    actionToken: string; // secret pour la signature HMAC (X-Hub-Signature-256)
  }): Promise<{ id?: number; raw?: any }> {
    const { repo, owner, userId, actionId, actionToken } = parameters;

    const user = await this.userModel.findOne({ uuid: userId }).lean().exec();
    if (!user || !(user as any).githubToken) {
      throw new UnauthorizedException('GitHub authentication required');
    }

    const baseUrl =
      this.configService.get<string>('BASE_URL') || 'http://localhost:8080';
    const callbackUrl = `${baseUrl.replace(/\/$/, '')}/hooks/github/${encodeURIComponent(actionId)}?token=${encodeURIComponent(actionToken)}`;

    const data = {
      name: 'web',
      active: true,
      events: ['push'], // ajoutez d’autres events si besoin
      config: {
        url: callbackUrl,
        content_type: 'json',
        secret: actionToken,
      },
    };

    const headers = {
      Authorization: `token ${(user as any).githubToken}`,
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
      // On remonte une 401 pour rester cohérent avec votre code existant
      throw new HttpException(
        `Failed to configure GitHub webhook: ${message}`,
        HttpStatus.UNAUTHORIZED,
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

    const user = await this.userModel.findOne({ uuid: userId }).lean().exec();
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
