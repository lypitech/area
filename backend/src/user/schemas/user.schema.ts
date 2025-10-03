import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid_v4 } from 'uuid';
//import { OAuth } from 'src/database/schemas/oauth.schema';

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

  @Prop()
  githubToken: string;

  /*  @Prop({
      type: [{ type: mongoose_schema.Types.ObjectId, ref: 'Oauth' }],
      default: [],
    })
    OAuth_ids?: OAuth[];*/
}

export const UserSchema = SchemaFactory.createForClass(User);
