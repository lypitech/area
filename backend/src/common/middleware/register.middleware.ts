import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from 'src/user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RegisterMiddleware implements NestMiddleware {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const email: string = req.body['email'];
    const user: User | null = await this.userModel.findOne({ email });
    if (user) {
      throw new BadRequestException('Email already used');
    }
    next();
  }
}
