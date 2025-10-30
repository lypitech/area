import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid_v4 } from 'uuid';

@Schema()
export class Reaction extends Document {
  @Prop({ required: true, unique: true, default: uuid_v4 })
  uuid!: string;

  @Prop({ required: true })
  service_name!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ type: Object, required: true })
  parameters!: Record<string, any>;

  @Prop({ type: Object, required: true })
  schema_input: Record<string, any>; // this field is required to be a json with expected fields by the service
}

export interface ReactionType {
  uuid?: string;
  service_name: string;
  name: string;
  parameters: Record<string, any>;
  description: string;
  schema_input: Record<string, any>;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
