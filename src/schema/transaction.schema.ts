import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema()
export class Transaction {
  @Prop()
  event: string;

  @Prop()
  fired_by_batch_action: boolean;

  @Prop()
  _id: string;

  @Prop(
    raw({
      fired_at: { type: Date },
      user_id: { type: String },
      username: { type: String },
      course_id: { type: Number },
      course_name: { type: String },
      level: { type: String },
      enrollment_date: { type: Date },
      enrollment_date_begin_validity: { type: Date },
      enrollment_date_end_validity: { type: Date },
      subscribed_by_id: { type: Number },
      status: { type: String },
    }),
  )
  payload: Record<string, any>;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
