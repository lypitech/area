import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Reaction } from 'src/reaction/schemas/reaction.schema';
import { firstValueFrom } from 'rxjs';

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

  async sendMessage(reaction: Reaction, action_payload: string) {
    if (reaction.service_resource_id == null) {
      throw new HttpException(
        'Service Resource not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    // si `action_payload` est déjà un message string, garde-le
    const message =
      typeof action_payload === 'string'
        ? { content: action_payload }
        : { content: String(action_payload) };

    const url = reaction.service_resource_id;
    console.log(`Sending ${JSON.stringify(message)} to ${url}`);

    try {
      const res = await firstValueFrom(
        this.httpService.post(url, message, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10_000,
        }),
      );
      // Discord renvoie souvent 204 No Content sur succès
      console.log('Discord webhook response status:', res.status);
      return { ok: true, status: res.status };
    } catch (e: any) {
      const status = e?.response?.status ?? 500;
      const data = e?.response?.data;
      console.error('Discord webhook error:', status, data);
      throw new HttpException(`Discord webhook error: ${status}`, status);
    }
  }
}
