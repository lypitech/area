import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuid_v4 } from 'uuid';

@Schema({ timestamps: true, versionKey: false })
export class ReactionInstance {
  @Prop({ required: true, unique: true, default: () => uuid_v4() })
  uuid!: string;

  @Prop({ required: true })
  service_name!: string;

  @Prop({ required: true })
  name!: string;

  @Prop()
  description?: string;

  @Prop()
  oauth_token?: string;

  @Prop({ default: null })
  service_resource_id?: string;

  @Prop({ required: true })
  payload!: string;
}

export const ResponseSchema = SchemaFactory.createForClass(ReactionInstance);
