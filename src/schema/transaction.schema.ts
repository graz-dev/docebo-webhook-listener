import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ collection: 'transactions' })
export class Transaction {
  @Prop()
  event: string;

  @Prop()
  fired_by_batch_action: boolean;

  @Prop()
  _id: string;

  @Prop()
  created_at: Date;

  @Prop(raw({}))
  payload: Record<string, any>;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
