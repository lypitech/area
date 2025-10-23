import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ReactionInstance } from 'src/response/schemas/response.schema';
import type { DispatchFunction } from 'src/response/response.service';

@Injectable()
export class DiscordReactionService {
  private _base_url: string = 'https://discord.com/api/v10';
  private readonly dispatchers = new Map<string, DispatchFunction>();
  constructor(private readonly httpService: HttpService) {
    this.dispatchers.set('Send message', (reaction, str) => {
      this.sendMessage(reaction, str);
    });
  }

  dispatch(reaction: ReactionInstance, action_payload: string) {
    const reaction_name: string = reaction.name;
    const dispatcher = this.dispatchers.get(reaction_name); // Map method
    if (!dispatcher) {
      throw new NotFoundException(`No dispatcher for ${reaction_name}.`);
    }
    dispatcher(reaction, action_payload);
  }

  private sendRequest(url: string, payload: object) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    };
    return this.httpService.post(url, payload, { headers });
  }

  private sendMessage(reaction: ReactionInstance, action_payload: string) {
    const channelId = reaction.resource_id;
    const url = `${this._base_url}/channels/${channelId}/messages`;
    const message = action_payload; // create helper function to retrieve the infos
    const payload = {
      content: message,
      tts: false,
    };

    this.sendRequest(url, payload);
  }
}
