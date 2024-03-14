import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionErrorDocument = HydratedDocument<TransactionError>;

@Schema({ collection: 'transaction_errors' })
export class TransactionError {
  @Prop()
  event: string;

  @Prop()
  _id: string;

  @Prop()
  message_id: string;

  @Prop()
  error_message: string;
}

export const TransactionErrorSchema =
  SchemaFactory.createForClass(TransactionError);
