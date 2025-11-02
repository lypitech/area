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
import { AreaService } from 'src/area/area.service';
import { Area } from '../area/schemas/area.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Oauth.name) private oauthModel: Model<Oauth>,
    private readonly areaService: AreaService,
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
      { 'oauth_uuids.token_uuid': oauth_token_uuid },
      { $pull: { oauth_uuids: { oauth_token_uuid } } },
    );
    await this.oauthModel.findOneAndDelete({ uuid: oauth_token_uuid });
    if (!updated) {
      throw new NotFoundException(`No user with oauth ${oauth_token_uuid}`);
    }
    return updated;
  }

  async removeOauthTokenByService(
    uuid: string,
    service: string,
  ): Promise<User> {
    const user: UserDto = await this.findByUUID(uuid);
    if (!user) {
      throw new NotFoundException(`No user with uuid ${uuid} found.`);
    }
    for (const oauth of user.oauth_uuids) {
      if (oauth.service_name === service) {
        return this.removeOauthTokenByUUID(oauth.token_uuid);
      }
    }
    throw new BadRequestException(`User is not connected to ${service}.`);
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

  async remove(uuid: string) {
    const user = await this.userModel.findOne({ uuid: uuid });
    if (!user) {
      throw new NotFoundException(`No user with uuid ${uuid}`);
    }
    for (const oauth of user.oauth_uuids) {
      await this.removeOauthTokenByUUID(oauth.token_uuid);
    }
    const areas: Area[] = await this.areaService.findAll(uuid);
    for (const area of areas) {
      await this.areaService.remove(area.uuid);
    }
    const deleted: DeleteResult = await this.userModel.deleteOne({ uuid });
    if (!deleted) {
      throw new NotFoundException(`No oauth with uuid ${uuid}.`);
    }
    return { message: 'User deleted successfully' };
  }

  async getUserTokenByService(
    user_uuid: string,
    service: string,
  ): Promise<Oauth> {
    const user = await this.findByUUID(user_uuid);
    if (!user) {
      throw new NotFoundException(`No user with uuid ${user_uuid} found.`);
    }

    for (const oauth_uuid of user.oauth_uuids) {
      const oauth = await this.oauthModel.findOne({ uuid: oauth_uuid });
      if (oauth && oauth.service_name === service) {
        return oauth;
      }
    }

    throw new NotFoundException(`No OAuth token found for service ${service}.`);
  }

  async updateUser(
    uuid: string,
    updateData: Partial<UserDto>,
  ): Promise<string> {
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
