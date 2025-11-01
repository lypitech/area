import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid_v4 } from 'uuid';

type oauth_uuid = string;
type service_name = string;

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true, default: uuid_v4 })
  uuid!: string;

  @Prop()
  nickname!: string;

  @Prop()
  username!: string;

  @Prop()
  password!: string;

  @Prop({ sparse: true })
  email!: string;

  @Prop()
  profilePicture?: string;

  @Prop()
  refreshToken?: string;

  @Prop({ required: true, default: [] })
  oauth_uuids!: [service_name, oauth_uuid];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { email: { $exists: true, $ne: null } },
  },
);
