import { Document } from 'mongoose';

export interface IPayload extends Document {
  readonly fired_at: Date;
  readonly user_id: number;
  readonly username: string;
  readonly course_id: number;
  readonly course_name: string;
  readonly level: string;
  readonly enrollment_date: Date;
  readonly enrollment_date_begin_validity: Date | null;
  readonly enrollment_date_end_validity: Date | null;
  readonly subscribed_by_id: number;
  readonly status: string;
}

export interface ITransaction extends Document {
  readonly event: Date;
  readonly fired_by_batch_action: boolean;
  readonly message_id: string;
  readonly payload: IPayload;
}
