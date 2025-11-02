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

  @Prop()
  requires_payload?: boolean;

  @Prop({ type: Object, required: true })
  parameters!: Record<string, any>[];
}

export interface ReactionType {
  uuid?: string;
  service_name: string;
  name: string;
  requires_payload: boolean;
  parameters: Record<string, any>[];
  description: string;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
