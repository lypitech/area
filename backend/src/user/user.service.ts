import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
//import { OAuth } from '../database/schemas/oauth.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(): Promise<User[]> {
    const users: User[] = await this.userModel.find();
    return users;
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

  async createNew(
    email: string,
    password: string,
    nickname: string,
    username: string,
    profilePicture: string = '',
    //OAuth_ids: OAuth[] = [],
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      email: email,
      password: hashedPassword,
      nickname: nickname,
      username: username,
      profilePicture: profilePicture,
      //OAuth_ids: OAuth_ids,
    });
    return user.save();
  }
  async update(uuid: string, updateData: Partial<User>): Promise<User> {
    const updatedUser = await this.userModel
      .findOneAndUpdate( { uuid } , updateData, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${uuid} not found`);
    }

    return updatedUser;
  }
}
