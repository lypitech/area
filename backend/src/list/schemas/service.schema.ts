import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid_v4 } from 'uuid';

export type ActionServiceType = {
  uuid: string;
  name: string;
  parameters: Record<string, any>;
  description: string;
  trigger_types: string[];
};

export type ReactionServiceType = {
  uuid: string;
  name: string;
  parameters: Record<string, any>;
  description: string;
};

@Schema()
export class Service extends Document {
  @Prop({ required: true, unique: true, default: uuid_v4 })
  uuid!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  icon!: string;

  @Prop({ type: Object })
  endpoints?: Record<string, string>;

  @Prop({ type: Object })
  actions!: ActionServiceType[];

  @Prop({ type: Object })
  reactions!: ReactionServiceType[];
}

export interface ServiceType {
  uuid?: string;
  name: string;
  icon: string;
  endpoints: string[];
  actions: ActionServiceType[];
  reactions: ReactionServiceType[];
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
