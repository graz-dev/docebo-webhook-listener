import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EnrollmentDocument = HydratedDocument<Enrollment>;

@Schema({ collection: 'enrollments' })
export class Enrollment {
  @Prop()
  _id: string;

  @Prop()
  user_id: number;

  @Prop()
  username: string;

  @Prop()
  course_id: number;

  @Prop()
  course_name: string;

  @Prop()
  level: string;

  @Prop()
  enrollment_date: Date;

  @Prop()
  enrollment_date_begin_validity: Date | null;

  @Prop()
  enrollment_date_end_validity: Date | null;

  @Prop()
  status: string;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
