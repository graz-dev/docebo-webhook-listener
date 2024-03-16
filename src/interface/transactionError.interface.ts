import { Document } from 'mongoose';

export interface ITransactionError extends Document {
  readonly event: string;
  readonly _id: string;
  readonly message_id: string;
  readonly error_message: string;
  readonly created_at: Date;
}
