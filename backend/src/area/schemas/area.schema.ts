import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HistoryDto } from 'src/area/types/historyDto';
import { v4 as uuid_v4 } from 'uuid';

@Schema({ timestamps: true, versionKey: false })
export class Area {
  @Prop({ required: true, unique: true, default: () => uuid_v4() })
  uuid!: string;

  @Prop({ required: true, index: true })
  trigger_uuid!: string;

  @Prop({ required: true, index: true })
  response_uuid!: string;

  @Prop({ required: true, index: true })
  user_uuid!: string;

  @Prop({ required: true })
  name!: string;

  @Prop()
  description?: string;

  @Prop({ required: true, default: true })
  enabled!: boolean;

  @Prop({ type: Date, default: null })
  disabled_until?: Date | null;

  @Prop({ default: [] })
  history!: HistoryDto[];
}

export const AreaSchema = SchemaFactory.createForClass(Area);
