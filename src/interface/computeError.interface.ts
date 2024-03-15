import { Document } from 'mongoose';

export interface IComputeError extends Document {
  readonly event: string;
  readonly _id: string;
  readonly message_id: string;
  readonly error_message: string;
}
