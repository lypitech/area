import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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

  @Prop({ required: true })
  creation_date!: string;

  @Prop({ required: true, default: true })
  enabled!: boolean;

  @Prop({ type: Date, default: null })
  disabled_until?: Date | null;

  @Prop({ type: [{ timestamp: String, status: String }], default: [] })
  history!: { timestamp: string; status: string }[];
}

export type AreaCreationDTO = {
  trigger: {
    service_name: string;
    name: string;
    description: string | null;
    resource_id: string;
    oauth_token: string | null;
    trigger_type: string | null;
    every_minute: string | null;
  };
  response: {
    service_name: string;
    name: string;
    description: string | null;
    resource_id: string;
    oauth_token: string | null;
    payload: string;
  };
  user_uuid: string;
  name: string;
  description: string | null;
  enabled: boolean;
  disabled_until: Date | null;
};

export const AreaSchema = SchemaFactory.createForClass(Area);
