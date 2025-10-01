import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid_v4 } from 'uuid';

@Schema()
export class ActionSelection extends Document {
  @Prop({ required: true, unique: true, default: uuid_v4 })
  uuid!: string;

  @Prop({ required: true })
  service_name!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  trigger_types: string[]; // list of the available trigger types
}

export interface ActionSelectionType {
  uuid?: string;
  service_name: string;
  name: string;
  description: string;
  trigger_types: string[];
}

export const ActionSelectionSchema =
  SchemaFactory.createForClass(ActionSelection);
