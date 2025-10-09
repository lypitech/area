import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type TriggerDocument = HydratedDocument<Trigger>;

export const TriggerTypes = ['webhook', 'polling', 'interval'] as const;
export type TriggerType = (typeof TriggerTypes)[number];

@Schema({ timestamps: true, versionKey: false })
export class Trigger {
  @Prop({ required: true, unique: true, default: uuidv4 })
  uuid!: string;

  @Prop({ required: true })
  service_name!: string;

  @Prop({ required: true })
  name!: string;

  @Prop()
  description?: string;

  @Prop({ default: null, type: String })
  service_resource_id?: string | null;

  @Prop({ default: null, type: String })
  oauth_token_id?: string | null;

  @Prop({ required: true, enum: TriggerTypes, default: 'webhook' })
  trigger_type!: TriggerType;

  @Prop({ default: 5 })
  every_minutes?: number;
}

export const TriggerSchema = SchemaFactory.createForClass(Trigger);
