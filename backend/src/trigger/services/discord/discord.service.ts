import { Injectable, Logger } from '@nestjs/common';
import { WebSocket } from 'ws';
import { discord_intents, discord_op } from './types';

@Injectable()
export class DiscordTriggerService {
  private readonly logger = new Logger(DiscordTriggerService.name);
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private lastSeq: number;
  private sessionId: string;

  constructor() {}

  setLastSeq(lastSeq: number) {
    this.lastSeq = lastSeq;
  }

  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  getSessionId(): string {
    return this.sessionId;
  }

  handleHello(ws: WebSocket, data: any) {
    const interval = data.heartbeat_interval as number;
    this.logger.log(`Received Hello, heartbeat every ${interval}ms`);
    this.startHeartbeat(ws, interval);
    this.identify(ws);
  }

  private startHeartbeat(ws: WebSocket, interval: number) {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = setInterval(() => {
      const payload = {
        op: 1,
        d: this.lastSeq,
      };
      this.logger.verbose('Sending heartbeat...');
      ws.send(JSON.stringify(payload));
    }, interval);
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = null;
  }

  reconnect(ws: WebSocket) {
    this.logger.warn('Reconnecting to Discord Gateway...');
    this.stopHeartbeat();
    ws.close();
  }

  identify(ws: WebSocket) {
    const token = process.env.DISCORD_BOT_TOKEN;
    if (!token) {
      this.logger.error('Missing DISCORD_BOT_TOKEN');
      return;
    }
    const intents =
      discord_intents.GUILDS +
      discord_intents.GUILD_MESSAGE +
      discord_intents.GUILD_MESSAGE_REACTION +
      discord_intents.MESSAGE_CONTENT;
    const payload = {
      op: discord_op.IDENTIFY,
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
    ws.send(JSON.stringify(payload));
  }
}
