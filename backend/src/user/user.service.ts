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

  async findByUUID(uuid: string): Promise<User> {
    const user: User | null = await this.userModel.findOne({ uuid });
    if (!user) {
      throw new NotFoundException(`No user with uuid ${uuid} found.`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user: User | null = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(`No user with email ${email}`);
    }
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
        return user;
      }
    }
    throw new NotFoundException('No user found with this refresh token');
  }

  async addOauthToken(user_uuid: string, token_uuid: string): Promise<User> {
    const updated: User | null = await this.userModel.findOneAndUpdate(
      { uuid: user_uuid },
      { $push: { oauth_uuids: { token_uuid } } },
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
  ): Promise<User> {
    return new this.userModel({
      email: email,
      password: await bcrypt.hash(password, 10),
      nickname: nickname,
      username: username,
      profilePicture: profilePicture,
    }).save();
  }

  async removeOauthTokenByUUID(oauth_token_uuid: string): Promise<User> {
    const updated: User | null = await this.userModel.findOneAndUpdate(
      { 'oauth_uuids.tokens': oauth_token_uuid },
      { $pull: { oauth_uuids: { oauth_token_uuid } } },
    );
    if (!updated) {
      throw new NotFoundException(`No user with oauth ${oauth_token_uuid}`);
    }
    return updated;
  }

  async update(uuid: string, updateData: Partial<User>): Promise<User> {
    const updatedUser: User | null = await this.userModel
      .findOneAndUpdate({ uuid }, updateData, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`no user with uuid ${uuid}`);
    }
    return updatedUser;
  }

  async remove(uuid: string) {
    const removed: User | null = await this.userModel.findOneAndDelete({
      uuid,
    });
    if (!removed) {
      throw new NotFoundException(`No user with uuid ${uuid}`);
    }
    return removed;
  }
}
