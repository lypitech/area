import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ReactionInstance } from 'src/response/schemas/response.schema';
import { DispatchReturn } from 'src/response/types/dispatchFunction';
import { catchError, firstValueFrom, map, Observable, of } from 'rxjs';

@Injectable()
export class DiscordReactionService {
  private _base_url: string = 'https://discord.com/api/v10';
  private readonly botToken = process.env.DISCORD_BOT_TOKEN;
  private readonly headers = {
    'Content-Type': 'application/json',
    Authorization: `Bot ${this.botToken}`,
  };
  constructor(private readonly httpService: HttpService) {}

  async getGuildId(channelId: string): Promise<string> {
    const guildResponse = this.httpService
      .get(`${this._base_url}/channels/${channelId}`, {
        headers: this.headers,
      })
      .pipe(
        catchError((err): Observable<null> => {
          throw new BadRequestException(
            err.status == 404
              ? 'Invalid channelID'
              : `Cannot access to channelId (${err.status})`,
          );
        }),
      );
    const data = await firstValueFrom(guildResponse);
    if (!data) throw new BadRequestException('Unknown error');
    return data.data.guild_id as string;
  }

  async getGuildChannel(channelId: string): Promise<Record<string, any>> {
    const guildResponse = this.httpService
      .get(`${this._base_url}/channels/${channelId}`, {
        headers: this.headers,
      })
      .pipe(
        catchError((err): Observable<null> => {
          throw new BadRequestException(
            `Cannot access to channel (${err.status})`,
          );
        }),
      );
    const data = await firstValueFrom(guildResponse);
    if (!data) throw new BadRequestException('Unknown error');
    return data.data;
  }

  async getMe(guildId: string): Promise<Record<string, any>> {
    const res = this.httpService
      .get(
        `${this._base_url}/guilds/${guildId}/members/${process.env.DISCORD_APP_ID}`,
        { headers: this.headers },
      )
      .pipe(
        catchError((err): Observable<null> => {
          throw new BadRequestException(
            `Cannot access to guild (${err.status})`,
          );
        }),
      );
    const data = await firstValueFrom(res);
    if (!data) throw new BadRequestException('Unknown error');
    return data.data as Record<string, any>;
  }

  async getRoles(guildId: string): Promise<Record<string, any>[]> {
    const res = this.httpService
      .get(`${this._base_url}/guilds/${guildId}/roles`, {
        headers: this.headers,
      })
      .pipe(
        catchError((err): Observable<null> => {
          throw new BadRequestException(
            `Cannot access to the roles (${err.status})`,
          );
        }),
      );
    const data = await firstValueFrom(res);
    if (!data) throw new BadRequestException('Unknown error');
    return data.data as Record<string, any>[];
  }

  private async sendPostRequest(
    url: string,
    payload: object,
  ): Promise<DispatchReturn> {
    const result = this.httpService
      .post(url, payload, { headers: this.headers })
      .pipe(
        map(() => ({ ok: true })), // success
        catchError((err): Observable<DispatchReturn> => {
          const ret: DispatchReturn = {
            ok: false,
            error: (err?.response?.data as string) ?? (err as Error),
          };
          return of(ret);
        }),
      );
    return firstValueFrom(result);
  }

  private async sendPutRequest(url: string): Promise<DispatchReturn> {
    const result = this.httpService
      .put(url, {}, { headers: this.headers })
      .pipe(
        map(() => ({ ok: true })),
        catchError((err): Observable<DispatchReturn> => {
          const ret: DispatchReturn = {
            ok: false,
            error: (err?.response?.data as string) ?? (err as Error),
          };
          return of(ret);
        }),
      );
    return firstValueFrom(result);
  }

  async sendMessage(
    response: ReactionInstance,
    action_payload: Record<string, any>,
  ) {
    const url = `${this._base_url}/channels/${response.resource_ids.channel_id}/messages`;
    const message = JSON.stringify(action_payload); // create helper function to retrieve the infos
    const payload = {
      content: message,
      tts: false,
    };
    return await this.sendPostRequest(url, payload);
  }

  async addRole(
    response: ReactionInstance,
    action_payload: Record<string, any>,
  ) {
    const url = `${this._base_url}/guilds/${response.resource_ids.guild_id}/members/${response.resource_ids.user_id}/roles/${response.resource_ids.role_id}`;
    return this.sendPutRequest(url);
  }
}
