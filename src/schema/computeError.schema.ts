import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ComputeErrorDocument = HydratedDocument<ComputeError>;

@Schema({ collection: 'compute_errors' })
export class ComputeError {
  @Prop()
  event: string;

  @Prop()
  _id: string;

  @Prop()
  message_id: string;

  @Prop()
  error_message: string;
}

export const ComputeErrorSchema = SchemaFactory.createForClass(ComputeError);
