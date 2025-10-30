import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type OauthDocument = HydratedDocument<Oauth>;

@Schema({ timestamps: true })
export class Oauth {
  @Prop({ required: true, default: uuidv4 })
  uuid: string;

  @Prop({ required: true })
  service_name: string;

  @Prop({ required: true })
  token: string;

  @Prop()
  refresh_token?: string;

  @Prop()
  token_type?: string;

  @Prop()
  expires_at?: Date;

  @Prop({ type: Object, default: {} })
  meta: {
    twitch_user_id?: string;
    twitch_login?: string;
    twitch_display_name?: string;
    profile_image_url?: string;
  };
}

export const OauthSchema = SchemaFactory.createForClass(Oauth);
