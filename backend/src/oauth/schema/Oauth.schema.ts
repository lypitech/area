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
}

export interface OauthType {
  uuid?: string;
  service_name: string;
  token: string;
  refresh_token: string;
  token_type: string;
  expires_at?: Date;
}

export const OauthSchema = SchemaFactory.createForClass(Oauth);
