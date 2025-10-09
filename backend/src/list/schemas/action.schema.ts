import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuid_v4 } from 'uuid';

export type ActionDocument = HydratedDocument<Action>;

const TRIGGER_TYPES = ['webhook'] as const;
type TriggerType = (typeof TRIGGER_TYPES)[number];

@Schema({ timestamps: true })
export class Action {
  @Prop({ required: true, unique: true, default: uuid_v4 })
  uuid!: string;

  @Prop({ required: true })
  service_name!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true, type: [String], enum: TRIGGER_TYPES })
  trigger_types!: TriggerType[];

  @Prop({ required: true, type: [{ type: Object }] })
  parameters!: Array<{
    name: string;
    type: string;
    description?: string;
    required?: boolean;
    [key: string]: any;
  }>;
}

export interface ActionType {
  uuid?: string;
  service_name: string;
  name: string;
  description: string;
  trigger_types: TriggerType[];
  parameters: Array<{
    name: string;
    type: string;
    description?: string;
    required?: boolean;
    [key: string]: any;
  }>;
}

export const ActionSchema = SchemaFactory.createForClass(Action);
