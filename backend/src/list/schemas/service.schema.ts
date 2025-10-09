import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid_v4 } from 'uuid';

@Schema()
export class Service extends Document {
  @Prop({ required: true, unique: true, default: uuid_v4 })
  uuid!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ type: Object })
  actions!: Record<string, any>;

  @Prop({ type: Object })
  reactions!: Record<string, any>;
}

export interface ServiceType {
  uuid?: string;
  name: string;
  actions: Record<string, any>[];
  reactions: Record<string, any>[];
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
