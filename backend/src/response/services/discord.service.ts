import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ReactionInstance } from 'src/response/schemas/response.schema';

@Injectable()
export class DiscordReactionService {
  constructor(private readonly httpService: HttpService) {}
  private _base_url: string = 'https://discord.com/api/';

  private sendRequest(url: string, payload: object) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    };
    return this.httpService.post(url, payload, { headers });
  }

  dispatch(reaction: ReactionInstance, action_payload: string) {
    const reaction_name: string = reaction.name;
    switch (reaction_name) {
      case 'send message':
        console.log('send message function called');
        return this.sendMessage(reaction, action_payload);
      default:
        return; // TODO: Throw custom exceptions
    }
  }

  sendMessage(reaction: ReactionInstance, action_payload: string) {
    const channelId = reaction.resource_id;
    const url = `https://discord.com/api/v10/channels/${channelId}/messages`;
    const message = action_payload; // create helper function to retrieve the infos
    const payload = {
      content: message,
      tts: false,
    };

    this.sendRequest(url, payload);
  }
}
