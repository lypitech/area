import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WebhookMappingDocument = HydratedDocument<WebhookMapping>;

@Schema({ timestamps: true, collection: 'webhook_mappings' })
export class WebhookMapping {
  @Prop({ index: true })
  hookId?: string; // X-GitHub-Hook-ID

  @Prop({ index: true })
  installationId?: number;

  @Prop({ index: true })
  repositoryFullName?: string; // owner/repo

  @Prop({ required: true })
  triggerUuid!: string;

  @Prop({ required: false })
  secret?: string;
}

export const WebhookMappingSchema =
  SchemaFactory.createForClass(WebhookMapping);
