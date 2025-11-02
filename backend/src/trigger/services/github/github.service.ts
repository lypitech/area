import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios, { AxiosError } from 'axios';
import { User } from 'src/user/schemas/user.schema';
import { Oauth } from 'src/oauth/schema/Oauth.schema';

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Oauth.name) private readonly oauthModel: Model<Oauth>,
  ) {}

  private get isDebug(): boolean {
    const v = (
      this.configService.get<string>('GITHUB_DEBUG') || ''
    ).toLowerCase();
    if (v === 'true' || v === '1' || v === 'yes') return true;
    const nodeEnv = (
      this.configService.get<string>('NODE_ENV') || ''
    ).toLowerCase();
    return nodeEnv !== 'production';
  }

  private mask(
    value?: string | null,
    opts?: { showStart?: number; showEnd?: number },
  ): string {
    if (!value) return '<empty>';
    const showStart = opts?.showStart ?? 3;
    const showEnd = opts?.showEnd ?? 3;
    if (value.length <= showStart + showEnd) return '<redacted>';
    return `${value.slice(0, showStart)}***${value.slice(-showEnd)}`;
  }

  private logAxiosError(
    ctx: string,
    err: AxiosError,
    extra?: Record<string, any>,
  ) {
    const status = err.response?.status;
    const statusText = err.response?.statusText;
    const data = err.response?.data;
    const url = err.config?.url;
    const method = err.config?.method;
    const headers = { ...(err.config?.headers || {}) };

    if ('Authorization' in headers) headers['Authorization'] = '<redacted>';

    this.logger.error(
      `[${ctx}] GitHub HTTP error ${status} ${statusText} ${method?.toUpperCase()} ${url} :: ${JSON.stringify(
        { ...(extra || {}), headers, response: data },
      )}`,
    );
  }

  private sanitizeUrl(url: string): string {
    try {
      const u = new URL(url);
      if (u.searchParams.has('token'))
        u.searchParams.set('token', '<redacted>');
      return u.toString();
    } catch {
      return '<invalid-url>';
    }
  }

  private async resolveGithubToken(userId: string): Promise<string> {
    const envPat =
      this.configService.get<string>('GITHUB_PAT') ??
      this.configService.get<string>('GITHUB_PERSONAL_ACCESS_TOKEN') ??
      this.configService.get<string>('GITHUB_TOKEN') ??
      this.configService.get<string>('GH_TOKEN');

    if (envPat && envPat.trim() !== '') {
      if (this.isDebug) {
        this.logger.debug(
          `[resolveGithubToken] Using ENV PAT for user ${this.mask(userId, { showStart: 4, showEnd: 4 })}`,
        );
      }
      return envPat.trim();
    }

    if (this.isDebug) {
      this.logger.debug(
        `[resolveGithubToken] No ENV PAT found. Falling back to OAuth in DB for user ${this.mask(userId, { showStart: 4, showEnd: 4 })}`,
      );
    }

    const user = await this.userModel
      .findOne({ uuid: userId }, { oauth_uuids: 1, _id: 0 })
      .lean();

    if (!user) {
      this.logger.warn(`[resolveGithubToken] User not found: ${userId}`);
      throw new UnauthorizedException('User not found');
    }

    const links: Array<{ service_name: string; token_uuid: string }> = (
      user.oauth_uuids ?? []
    )
      .map((entry: any) => {
        if (!entry) return null;
        if (Array.isArray(entry) && entry.length === 2) {
          return {
            service_name: String(entry[0]),
            token_uuid: String(entry[1]),
          };
        }
        if (
          typeof entry === 'object' &&
          entry.service_name &&
          entry.token_uuid
        ) {
          return {
            service_name: String(entry.service_name),
            token_uuid: String(entry.token_uuid),
          };
        }
        return null;
      })
      .filter(Boolean) as any[];

    const ghLinks = links.filter(
      (l) => l.service_name.toLowerCase() === 'github',
    );
    const tokenUuids = ghLinks.map((l) => l.token_uuid);

    if (tokenUuids.length === 0) {
      this.logger.warn(
        `[resolveGithubToken] No GitHub OAuth link for user ${this.mask(userId, { showStart: 4, showEnd: 4 })}`,
      );
      throw new UnauthorizedException('GitHub authentication required');
    }

    const oauth = await this.oauthModel
      .findOne({
        uuid: { $in: tokenUuids },
        service_name: 'github',
      })
      .lean();

    if (!oauth?.token) {
      this.logger.warn(
        `[resolveGithubToken] No GitHub OAuth token doc found for user ${this.mask(userId, { showStart: 4, showEnd: 4 })}`,
      );
      throw new UnauthorizedException('GitHub authentication required');
    }

    if (this.isDebug) {
      this.logger.debug(
        `[resolveGithubToken] Using OAuth token from DB for user ${this.mask(userId, { showStart: 4, showEnd: 4 })}`,
      );
    }

    return oauth.token as string;
  }

  async configureWebhook(parameters: {
    repo: string;
    owner: string;
    userId: string;
    actionId: string;
    actionToken: string;
    event: string;
  }): Promise<{ id?: number; raw?: any }> {
    const { repo, owner, userId, actionId, actionToken, event } = parameters;

    if (this.isDebug) {
      this.logger.debug(
        `[configureWebhook] Input :: owner=${owner} repo=${repo} userId=${this.mask(
          userId,
          {
            showStart: 4,
            showEnd: 4,
          },
        )} actionId=${actionId} actionToken=${this.mask(actionToken)} event=${event}`,
      );
    }

    const githubToken = await this.resolveGithubToken(userId);

    const baseUrl =
      this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
    const callbackUrl = `${baseUrl.replace(/\/$/, '')}/hooks/github/${encodeURIComponent(
      actionId,
    )}?token=${encodeURIComponent(actionToken)}`;

    if (this.isDebug) {
      this.logger.debug(
        `[configureWebhook] Callback URL = ${this.sanitizeUrl(callbackUrl)} (BASE_URL=${baseUrl})`,
      );
    }

    const data = {
      name: 'web',
      active: true,
      events: [event],
      config: {
        url: callbackUrl,
        content_type: 'json',
        secret: actionToken,
      },
    };

    const headers = {
      Authorization: `Bearer ${githubToken}`,
      'User-Agent': 'your-app-name',
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
    };

    if (this.isDebug) {
      const safeHeaders = { ...headers, Authorization: '<redacted>' };
      const safeData = {
        ...data,
        config: {
          ...data.config,
          url: this.sanitizeUrl(data.config.url),
          secret: '<redacted>',
        },
      };
      this.logger.debug(
        `[configureWebhook] Request :: POST /repos/${owner}/${repo}/hooks :: headers=${JSON.stringify(
          safeHeaders,
        )} body=${JSON.stringify(safeData)}`,
      );
    }

    try {
      const response = await axios.post(
        `https://api.github.com/repos/${owner}/${repo}/hooks`,
        data,
        { headers },
      );

      if (this.isDebug) {
        this.logger.debug(
          `[configureWebhook] Success :: hookId=${response.data?.id} status=${response.status}`,
        );
      }

      return { id: response.data?.id, raw: response.data };
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        this.logAxiosError('configureWebhook', error, {
          owner,
          repo,
          userIdMasked: this.mask(userId, { showStart: 4, showEnd: 4 }),
        });
      }
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

  async deleteWebhook(parameters: {
    owner: string;
    repo: string;
    userId: string;
    hookId: number;
  }): Promise<void> {
    const { owner, repo, userId, hookId } = parameters;

    if (this.isDebug) {
      this.logger.debug(
        `[deleteWebhook] Input :: owner=${owner} repo=${repo} userId=${this.mask(
          userId,
          {
            showStart: 4,
            showEnd: 4,
          },
        )} hookId=${hookId}`,
      );
    }

    const githubToken = await this.resolveGithubToken(userId);

    const headers = {
      Authorization: `Bearer ${githubToken}`,
      Accept: 'application/vnd.github+json',
    };

    if (this.isDebug) {
      const safeHeaders = { ...headers, Authorization: '<redacted>' };
      this.logger.debug(
        `[deleteWebhook] Request :: DELETE /repos/${owner}/${repo}/hooks/${hookId} :: headers=${JSON.stringify(
          safeHeaders,
        )}`,
      );
    }

    try {
      await axios.delete(
        `https://api.github.com/repos/${owner}/${repo}/hooks/${hookId}`,
        { headers },
      );
      if (this.isDebug) {
        this.logger.debug(`[deleteWebhook] Success`);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        this.logAxiosError('deleteWebhook', error, {
          owner,
          repo,
          userIdMasked: this.mask(userId, { showStart: 4, showEnd: 4 }),
          hookId,
        });
      }
      const message =
        error?.response?.data?.message ??
        error?.message ??
        'unknown GitHub error';
      throw new HttpException(
        `Failed to delete GitHub webhook: ${message}`,
        error?.response?.status ?? HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
