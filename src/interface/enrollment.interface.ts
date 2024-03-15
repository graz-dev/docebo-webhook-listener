import { Document } from 'mongoose';

export interface IEnrollment extends Document {
  readonly _id: string;
  readonly user_id: number;
  readonly username: string;
  readonly course_id: number;
  readonly course_name: string;
  readonly completion_date: Date | null;
  readonly level: string;
  readonly enrollment_date: Date;
  readonly enrollment_date_begin_validity: Date | null;
  readonly enrollment_date_end_validity: Date | null;
  readonly status: string;
}
