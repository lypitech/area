import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 } from 'uuid';

@Schema({ timestamps: true })
export class Action extends Document {
  @Prop({ required: true, unique: true, default: () => v4() })
  uuid!: string;

  @Prop({ required: true })
  service_name!: string;

  @Prop({ required: true })
  name!: string;

  @Prop()
  description?: string;
}

export const ActionSchema = SchemaFactory.createForClass(Action);
