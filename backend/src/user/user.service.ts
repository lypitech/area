import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  removeOauthTokenByUUID(
    oauth_token_uuid: string
  ) {
    return this.userModel.findOneAndUpdate(
      { 'oauth_uuids.tokens': oauth_token_uuid },
      { $pull: { oauth_uuids: { oauth_token_uuid } } },
      { new: true },
    );
  }

  createOauthToken(user_uuid: string, token_uuid: string) {
    return this.userModel.findOneAndUpdate(
      { uuid: user_uuid },
      { $push: { oauth_uuids: { token_uuid } } },
      { new: true },
    );
  }

  async findByUUID(
    uuid: string
  ): Promise<User> {
    const user: User | null = await this.userModel.findOne({ uuid: uuid });
    if (!user) {
      throw new NotFoundException(`No user with uuid ${uuid} found.`);
    }
    return user;
  }

  async findByEmail(
    email: string
  ): Promise<User> {
    const user: User | null = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new NotFoundException(`No user with email ${email}`);
    }
    return user;
  }

  async getUser(
    refreshToken: string
  ): Promise<Partial<User>> {
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const users = await this.userModel.find({});
    for (const user of users) {
      if (user.refreshToken && await bcrypt.compare(refreshToken, user.refreshToken)) {
        const { uuid, nickname, username, email, profilePicture } = user.toObject();
        return { uuid, nickname, username, email, profilePicture };
      }
    }
    throw new NotFoundException('No user found with this refresh token');
  }

  async createNew(
    email: string,
    password: string,
    nickname: string,
    username: string,
    profilePicture: string = '',
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      email: email,
      password: hashedPassword,
      nickname: nickname,
      username: username,
      profilePicture: profilePicture,
    });
    return user.save();
  }
  async update(uuid: string, updateData: Partial<User>): Promise<User> {
    const updatedUser = await this.userModel
      .findOneAndUpdate({ uuid: uuid }, updateData, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${uuid} not found`);
    }

    return updatedUser;
  }
}
