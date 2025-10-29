import { Injectable, Logger } from '@nestjs/common';
import { WebSocket } from 'ws';

const discord_op = {
  HELLO: 10,
  HEARTBEAT: 11,
  DISPATCH: 0,
  RECONNECT: 7,
  INVALID: 9,
};

@Injectable()
export class DiscordTriggerService {
  private readonly logger = new Logger(DiscordTriggerService.name);
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private ws: WebSocket;
  private lastSeq: number;
  private sessionId: string;

  constructor() {}

  handleGatewayMessage(ws: WebSocket, message: any) {
    this.ws = ws;
    const payload = JSON.parse(message.toString());
    const { t, s, op, d } = payload;

    if (s) this.lastSeq = s as number;

    switch (op) {
      case discord_op.HELLO:
        this.handleHello(d);
        break;
      case discord_op.HEARTBEAT:
        this.logger.verbose('Heartbeat ACK');
        break;
      case discord_op.DISPATCH:
        this.handleDispatch(t, d);
        break;
      case discord_op.RECONNECT:
        this.logger.warn('Gateway requested reconnect');
        this.reconnect();
        break;
      case discord_op.INVALID:
        this.logger.warn('Invalid session, re-identifying soon...');
        setTimeout(() => this.identify(), 5000);
        break;
      default:
        this.logger.debug(`Unhandled opcode ${op}`);
    }
  }

  handleHello(data: any) {
    const interval = data.heartbeat_interval as number;
    this.logger.log(`Received Hello, heartbeat every ${interval}ms`);
    this.startHeartbeat(interval);
    this.identify();
  }

  private startHeartbeat(interval: number) {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = setInterval(() => {
      const payload = {
        op: 1,
        d: this.lastSeq,
      };
      this.logger.verbose('Sending heartbeat...');
      this.ws?.send(JSON.stringify(payload));
    }, interval);
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = null;
  }

  handleDispatch(event: any, data: any) {
    switch (event) {
      case 'READY':
        this.sessionId = data.session_id as string;
        this.logger.log(`READY received. Session ID: ${this.sessionId}`);
        break;
      case 'MESSAGE_CREATE':
        this.logger.log(
          `Message created by ${data.author.username}: ${data.content}`,
        );
        break;
      case 'MESSAGE_REACTION_ADD':
        this.logger.log(
          `Reaction added: ${data.emoji.name} on message ${data.message_id}`,
        );
        break;
      default:
        break;
    }
  }

  private reconnect() {
    this.logger.warn('Reconnecting to Discord Gateway...');
    this.stopHeartbeat();
    this.ws?.close();
  }

  private identify() {
    const token = process.env.DISCORD_BOT_TOKEN;
    if (!token) {
      this.logger.error('Missing DISCORD_BOT_TOKEN');
      return;
    }
    const intents = 1 + 512;
    const payload = {
      op: 2,
      d: {
        token,
        intents,
        properties: {
          $os: process.platform,
          $browser: 'area-app',
          $device: 'area-app',
        },
      },
    };

    this.logger.log('Sending Identify payload...');
    this.ws.send(JSON.stringify(payload));
  }
}
