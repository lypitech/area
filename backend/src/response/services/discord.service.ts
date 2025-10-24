import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ReactionInstance } from 'src/response/schemas/response.schema';
import {
  DispatchFunction,
  DispatchReturn,
} from 'src/response/types/dispatchFunction';
import { catchError, firstValueFrom, map, Observable, of } from 'rxjs';

@Injectable()
export class DiscordReactionService {
  private _base_url: string = 'https://discord.com/api/v10';
  private readonly dispatchers = new Map<string, DispatchFunction>();
  constructor(private readonly httpService: HttpService) {
    this.dispatchers.set('Send message', (reaction, payload) => {
      return this.sendMessage(reaction, payload);
    });
  }

  dispatch(reaction: ReactionInstance, action_payload: Record<string, any>) {
    const reaction_name: string = reaction.name;
    const dispatcher = this.dispatchers.get(reaction_name); // Map method
    if (!dispatcher) {
      throw new NotFoundException(`No dispatcher for ${reaction_name}.`);
    }
    return dispatcher(reaction, action_payload);
  }

  private async sendRequest(
    url: string,
    payload: object,
  ): Promise<DispatchReturn> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    };
    const result = this.httpService.post(url, payload, { headers }).pipe(
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

  private async sendMessage(
    reaction: ReactionInstance,
    action_payload: Record<string, any>,
  ) {
    const channelId = reaction.resource_id;
    const url = `${this._base_url}/channels/${channelId}/messages`;
    const message = JSON.stringify(action_payload); // create helper function to retrieve the infos
    const payload = {
      content: message,
      tts: false,
    };

    return await this.sendRequest(url, payload);
  }
}
