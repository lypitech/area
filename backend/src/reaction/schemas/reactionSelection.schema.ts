import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid_v4 } from 'uuid';

@Schema()
export class ReactionSelection extends Document {
  @Prop({ required: true, unique: true, default: uuid_v4 })
  uuid!: string;

  @Prop({ required: true })
  service_name!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  schema_input: string; // this field is required to be a json specifying expected infos for the service
}

export interface ReactionSelectionType {
  uuid?: string;
  service_name: string;
  name: string;
  description: string;
  schema_input: string;
}

export const ReactionSelectionSchema =
  SchemaFactory.createForClass(ReactionSelection);
