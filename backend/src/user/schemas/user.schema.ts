import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid_v4 } from 'uuid';

type UserOauthLink = { service_name: string; token_uuid: string };

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true, default: uuid_v4 })
  uuid!: string;

  @Prop({ required: true })
  nickname!: string;

  @Prop({ required: true })
  username!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: false, default: '' })
  profilePicture?: string;

  @Prop({ required: false, default: null })
  refreshToken?: string;

  @Prop({
    required: true,
    default: [],
    type: [{ service_name: String, token_uuid: String }],
  })
  oauth_uuids!: UserOauthLink[];
}

export const UserSchema = SchemaFactory.createForClass(User);
