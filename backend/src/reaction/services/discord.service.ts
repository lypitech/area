import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Reaction } from 'src/reaction/schemas/reaction.schema';

@Injectable()
export class DiscordReactionService {
  constructor(private readonly httpService: HttpService) {}
  private _base_url: string = 'https://discord.com/api/';

  dispatch(reaction: Reaction, action_payload: string) {
    const reaction_name: string = reaction.name;
    console.log('Reaction name:', reaction_name);
    switch (reaction_name) {
      case 'send message':
        console.log('send message function called');
        return this.sendMessage(reaction, action_payload);
      default:
        return; // TODO: Throw custom exceptions
    }
  }

  sendMessage(reaction: Reaction, action_payload: string) {
    const payload: string = action_payload;
    let url: string;
    if (!reaction.service_resource_id) {
      throw new HttpException(
        'Service Resource not found.',
        HttpStatus.NOT_FOUND,
      );
    }
    if (reaction.service_resource_id?.startsWith(this._base_url)) {
      url = reaction.service_resource_id;
    } else {
      url = this._base_url + reaction.service_resource_id;
    }
    console.log(`Sending ${payload} to ${url}`);
    const message = {
      content: payload,
    };
    console.log('Message:', message);
    this.httpService.post(url, message);
  }
}
