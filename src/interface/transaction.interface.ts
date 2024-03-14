import { Document } from 'mongoose';

export interface ITransaction extends Document {
  readonly event: Date;
  readonly fired_by_batch_action: boolean;
  readonly _id: string;
  readonly payload: any;
}
