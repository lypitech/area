import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    return this.userService.create(email, password, username, nickname);
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.uuid, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.update(user.uuid, {
      refreshToken: hashedRefreshToken,
    });

    return {
      uuid: user.uuid,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    const payload: Record<string, string> = await this.jwtService.verify(
      refreshToken,
      { secret: process.env.JWT_REFRESH_SECRET },
    );

    const user = await this.userService.findByUUID(payload.sub);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!(await bcrypt.compare(refreshToken, user.refreshToken))) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newAccessToken = this.jwtService.sign(
      { sub: user.uuid, email: user.email },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
      },
    );

    return { access_token: newAccessToken };
  }

  async logout(uuid: string) {
    await this.userService.update(uuid, { refreshToken: undefined });
    return { message: 'Logged out successfully' };
  }
}
