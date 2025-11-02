import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuid_v4 } from 'uuid';

@Schema({ timestamps: true, versionKey: false })
export class Area {
  @Prop({ required: true, unique: true, default: () => uuid_v4() })
  uuid!: string;

  @Prop({ required: true, index: true })
  action_uuid!: string;

  @Prop({ required: true, index: true })
  reaction_uuid!: string;

  @Prop({ required: true, index: true })
  user_uuid!: string;

  @Prop({ required: true })
  name!: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  creation_date!: string;

  @Prop({ required: true, default: true })
  enable!: boolean;

  @Prop({ type: Date, default: null })
  disabled_until?: Date | null;

  @Prop({ type: [{ timestamp: String, status: String }], default: [] })
  history!: { timestamp: string; status: string }[];
}

export const AreaSchema = SchemaFactory.createForClass(Area);
