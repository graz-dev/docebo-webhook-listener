import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IEnrollment } from 'src/interface/enrollment.interface';
import { Enrollment } from 'src/schema/enrollment.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectModel('Enrollment') private enrollmentModel: Model<IEnrollment>,
  ) {}

  async createNewEnrollment(payload: Record<string, any>): Promise<Enrollment> {
    const e = await this.buildEnrollmentObject(payload);
    const newEnrollment = await new this.enrollmentModel(e);
    return newEnrollment.save();
  }

  private async buildEnrollmentObject(
    payload: Record<string, any>,
  ): Promise<any> {
    return {
      _id: uuidv4(),
      user_id: payload.user_id,
      username: payload.username,
      course_id: payload.course_id,
      course_name: payload.course_name,
      level: payload.level,
      enrollment_date: payload.enrollment_date,
      enrollment_date_begin_validity: payload.enrollment_date_begin_validity,
      enrollment_date_end_validity: payload.enrollment_date_end_validity,
      status: payload.status,
    };
  }
}
