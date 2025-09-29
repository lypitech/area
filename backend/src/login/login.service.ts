import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LoginService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    nickname: string,
    username: string,
  ) {
    return this.userService.createNew(email, password, username, nickname);
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user._id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
