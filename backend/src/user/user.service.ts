import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { DeleteResult, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserDto } from './types/userDto';
import { Oauth } from 'src/oauth/schema/Oauth.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Oauth.name) private oauthModel: Model<Oauth>,
    // private readonly jwtService: JwtService,
  ) {}

  async findAll(): Promise<UserDto[]> {
    const users: User[] = await this.userModel.find();
    return plainToInstance(
      UserDto,
      users.map((u) => {
        return u.toObject();
      }),
      { excludeExtraneousValues: true },
    );
  }

  // async login(user: User) {
  //   const payload = { sub: user.uuid, email: user.email };
  //   const accessToken = this.jwtService.sign(payload, {
  //     secret: process.env.JWT_ACCESS_SECRET,
  //     expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
  //   });
  //
  //   const refreshToken = this.jwtService.sign(payload, {
  //     secret: process.env.JWT_REFRESH_SECRET,
  //     expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
  //   });
  //
  //   const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  //   await this.update(user.uuid, {
  //     refreshToken: hashedRefreshToken,
  //   });
  //   return {
  //     uuid: user.uuid,
  //     access_token: accessToken,
  //     refresh_token: refreshToken,
  //   };
  // }

  async findByUUID(uuid: string): Promise<UserDto> {
    const user: User | null = await this.userModel.findOne({ uuid });
    if (!user) {
      throw new NotFoundException(`No user with uuid ${uuid} found.`);
    }
    return plainToInstance(UserDto, user.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user: User | null = await this.userModel.findOne({ email });
    return user;
  }

  async findUserByRefreshToken(refreshToken: string): Promise<Partial<User>> {
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const users: User[] = await this.userModel.find({});
    for (const user of users) {
      if (
        user.refreshToken &&
        (await bcrypt.compare(refreshToken, user.refreshToken))
      ) {
        return plainToInstance(UserDto, user.toObject(), {
          excludeExtraneousValues: true,
        });
      }
    }
    throw new NotFoundException('No user found with this refresh token');
  }

  async addOauthToken(
    user_uuid: string,
    token_uuid: string,
    service_name: string,
  ): Promise<User> {
    const updated: User | null = await this.userModel.findOneAndUpdate(
      { uuid: user_uuid },
      { $push: { oauth_uuids: { service_name, token_uuid } } },
      { new: true },
    );
    if (!updated) {
      throw new NotFoundException('Invalid user uuid');
    }
    return updated;
  }

  async create(
    email: string,
    password: string,
    nickname: string,
    username: string,
    profilePicture: string = '',
  ): Promise<UserDto> {
    const existing = await this.findByEmail(email);
    if (existing) {
      throw new BadRequestException(`Email ${email} already exists`);
    }
    const created = await new this.userModel({
      email: email,
      password: await bcrypt.hash(password, 10),
      nickname: nickname,
      username: username,
      profilePicture: profilePicture,
    }).save();
    return plainToInstance(UserDto, created.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async removeOauthTokenByUUID(oauth_token_uuid: string): Promise<User> {
    const updated: User | null = await this.userModel.findOneAndUpdate(
      { 'oauth_uuids.tokens': oauth_token_uuid },
      { $pull: { oauth_uuids: { oauth_token_uuid } } },
    );
    await this.oauthModel.findOneAndDelete({ uuid: oauth_token_uuid });
    if (!updated) {
      throw new NotFoundException(`No user with oauth ${oauth_token_uuid}`);
    }
    return updated;
  }

  async update(uuid: string, updateData: Partial<User>): Promise<User> {
    const updatedUser: User | null = await this.userModel.findOneAndUpdate(
      { uuid },
      updateData,
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException(`no user with uuid ${uuid}`);
    }
    return updatedUser;
  }

  async remove(uuid: string): Promise<boolean> {
    const deleted: DeleteResult = await this.userModel.deleteOne({ uuid });
    if (!deleted) {
      throw new NotFoundException(`No oauth with uuid ${uuid}.`);
    }
    return deleted.deletedCount === 1;
  }

  async updateUser(uuid: string, updateData: Partial<UserDto>): Promise<string> {
    const user: User | null = await this.userModel.findOne({ uuid });
    if (!user) {
      throw new NotFoundException(`No user with uuid ${uuid} found.`);
    }
    if (updateData.password) {
      const salt = await bcrypt.genSalt();
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    const updatedUser: User | null = await this.userModel.findOneAndUpdate(
      { uuid },
      { $set: updateData },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      throw new NotFoundException(`Failed to update user with uuid ${uuid}.`);
    }
    return `User successfully updated.`;
  }
}
