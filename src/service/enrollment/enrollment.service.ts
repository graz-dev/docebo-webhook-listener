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
    const e = await this.buildEnrollmentObject(payload, null);
    if (
      (await this.getEnrollmentByUserAndCourse(
        payload.user_id,
        payload.course_id,
      )) === null
    ) {
      const newEnrollment = await new this.enrollmentModel(e);
      return newEnrollment.save();
    } else {
      throw new Error(
        `Can't save new enrollment becouse it alerady exist with 'user_id' ${e.user_id} and 'course_id' ${e.course_id}`,
      );
    }
  }

  async updateEnrollment(payload: Record<string, any>): Promise<Enrollment> {
    const enrollment = await this.getEnrollmentByUserAndCourse(
      payload.user_id,
      payload.course_id,
    );
    if (enrollment === null) {
      throw new Error(
        `Can't update enrollment becouse no enrollment exist with 'user_id' ${payload.user_id} and 'course_id' ${payload.course_id}`,
      );
    } else {
      const e = await this.buildEnrollmentObject(payload, enrollment._id);
      const updEnrollment = this.enrollmentModel.findByIdAndUpdate(
        enrollment.id,
        e,
        { new: true },
      );
      return updEnrollment;
    }
  }

  async deleteEnrollment(payload: Record<string, any>): Promise<Enrollment> {
    const enrollment = await this.getEnrollmentByUserAndCourse(
      payload.user_id,
      payload.course_id,
    );
    if (enrollment === null) {
      throw new Error(
        `Can't delete enrollment becouse no enrollment exist with 'user_id' ${payload.user_id} and 'course_id' ${payload.course_id}`,
      );
    } else {
      const delEnrollment = this.enrollmentModel.findByIdAndDelete(
        enrollment.id,
      );
      return delEnrollment;
    }
  }

  async getEnrollmentByUserAndCourse(
    user_id: number,
    course_id: number,
  ): Promise<IEnrollment> {
    const existingEnrollment = await this.enrollmentModel.findOne({
      user_id: user_id,
      course_id: course_id,
    });
    return existingEnrollment;
  }

  private async buildEnrollmentObject(
    payload: Record<string, any>,
    _id: string,
  ): Promise<any> {
    return {
      _id: _id !== null ? _id : uuidv4(),
      user_id: payload.user_id,
      username: payload.username,
      course_id: payload.course_id,
      course_name: payload.course_name,
      level: payload.level,
      enrollment_date: payload.enrollment_date,
      enrollment_date_begin_validity: payload.enrollment_date_begin_validity,
      enrollment_date_end_validity: payload.enrollment_date_end_validity,
      completion_date: payload.completion_date,
      status: payload.status,
    };
  }
}
