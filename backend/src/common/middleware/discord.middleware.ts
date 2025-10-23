import { Injectable, NestMiddleware } from '@nestjs/common';
import { verifyKeyMiddleware } from 'discord-interactions';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DiscordMiddleware implements NestMiddleware {
  private readonly middlewareFn;
  constructor() {
    this.middlewareFn = verifyKeyMiddleware(
      process.env.DISCORD_APP_PUBLIC_KEY ?? '',
    );
  }
  use(req: Request, res: Response, next: NextFunction) {
    console.log('passing here');
    this.middlewareFn(req, res, (err?: any) => {
      if (err) {
        console.error('Discord verification failed:', err);
        return res.status(401).send({ error: 'Bad signature' });
      }
      next();
    });
  }
}
