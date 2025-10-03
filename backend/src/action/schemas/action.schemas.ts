import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ActionDocument = HydratedDocument<Action>;

export const TriggerTypes = ['webhook', 'polling'] as const;
export type TriggerType = (typeof TriggerTypes)[number];

@Schema({ timestamps: true, versionKey: false })
export class Action {
  @Prop({ required: true, unique: true, default: () => uuidv4() })
  uuid!: string;

  @Prop({ required: true })
  service_name!: string;

  @Prop({ required: true })
  name!: string;

  @Prop()
  description?: string;

  @Prop({ required: true, index: true })
  area_uuid!: string;

  @Prop({ default: null, type: String })
  service_resource_id?: string | null;

  @Prop({ required: true, select: false })
  token!: string;

  @Prop({ default: null, type: String })
  oauth_token_id?: string | null;

  @Prop({ required: true, enum: TriggerTypes })
  trigger_type!: TriggerType;
}

export const ActionSchema = SchemaFactory.createForClass(Action);
