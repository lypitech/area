import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
<<<<<<< HEAD
import { v4 as uuid_v4 } from 'uuid';

@Schema({ timestamps: true, versionKey: false })
export class Reaction {
  @Prop({ required: true, unique: true, default: () => uuid_v4() })
=======
import { Document } from 'mongoose';
import { v4 as uuid_v4 } from 'uuid';

@Schema()
export class Reaction extends Document {
  @Prop({ required: true, unique: true, default: uuid_v4 })
>>>>>>> 2e84b49 (feat(backend>reaction): Added `Reaction` module setup)
  uuid!: string;

  @Prop({ required: true })
  service_name!: string;

  @Prop({ required: true })
  name!: string;

<<<<<<< HEAD
  @Prop({ default: null })
  service_resource_id?: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  payload!: string;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
=======
  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  payload: string; // this field is required to be a json containing expected infos for the service
}

export const ReactionSchema =
  SchemaFactory.createForClass(Reaction);
>>>>>>> 2e84b49 (feat(backend>reaction): Added `Reaction` module setup)
