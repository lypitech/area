import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserDto } from 'src/user/types/userDto';
import { OauthService } from '../oauth/oauth.service';

type OauthRegisterFunction = (code: string) => Promise<UserDto>;
type OauthLoginFunction = (code: string) => Promise<{
  uuid: string;
  access_token: string;
  refresh_token: string;
}>;

@Injectable()
export class LoginService {
  private readonly oauthRegisterServices = new Map<
    string,
    OauthRegisterFunction
  >();
  private readonly oauthLoginServices = new Map<string, OauthLoginFunction>();
  constructor(
    private readonly userService: UserService,
    private readonly oauthService: OauthService,
    private jwtService: JwtService,
  ) {
    this.oauthLoginServices.set('github', (code: string) => {
      return this.oauthService.loginWithGithub(code);
    });
    this.oauthLoginServices.set('twitch', (code: string) => {
      return this.oauthService.loginWithTwitch(code);
    });
    this.oauthRegisterServices.set('github', (code) => {
      return this.oauthService.registerWithGithub(code);
    });
    this.oauthRegisterServices.set('twitch', (code) => {
      return this.oauthService.registerWithTwitch(code);
    });
  }

  async registerWith(code: string, service: string) {
    const oauthCreator = this.oauthRegisterServices.get(service.toLowerCase());
    if (oauthCreator) return oauthCreator(code);
    throw new NotFoundException(`Service ${service} not supported`);
  }

  async loginWith(code: string, service: string) {
    const oauthLogin = this.oauthLoginServices.get(service.toLowerCase());
    if (oauthLogin) return oauthLogin(code);
    throw new NotFoundException(`Service ${service} not supported`);
  }

  async register(
    email: string,
    password: string,
    nickname: string,
    username: string,
    profilePicture: string,
  ): Promise<UserDto> {
    return this.userService.create(
      email,
      password,
      username,
      nickname,
      profilePicture,
    );
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
    if (await this.userService.update(uuid, { refreshToken: undefined })) {
      return { message: 'Logged out successfully' };
    }
    throw new HttpException(
      { message: 'Could not log out' },
      HttpStatus.BAD_REQUEST,
    );
  }
}
