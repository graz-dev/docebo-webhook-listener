import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/schema/transaction.schema';
import { EnrollmentService } from '../enrollment/enrollment.service';
import { ComputeError } from 'src/schema/computeError.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IComputeError } from 'src/interface/computeError.interface';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ComputeService {
  constructor(
    private enrollmentService: EnrollmentService,
    @InjectModel('ComputeError')
    private computeErrorModel: Model<IComputeError>,
  ) {}

  async compute(transaction: Transaction) {
    try {
      if (transaction._id == null || transaction._id == undefined) {
        throw new Error('No "_id" available computing catched transaction.');
      }

      if (transaction.event == null || transaction.event == undefined) {
        throw new Error(
          `No "event" available computing transaction with "_id": ${transaction._id}.`,
        );
      }

      if (transaction.payload == null || transaction.payload == undefined) {
        throw new Error(
          `No "payload" available computing transaction with "_id": ${transaction._id}.`,
        );
      }

      switch (transaction.event) {
        case 'course.enrollment.created':
          await this.enrollmentService.createNewEnrollment(transaction.payload);
          break;
        case 'course.enrollment.update':
        case 'course.enrollment.completed':
          await this.enrollmentService.updateEnrollment(transaction.payload);
          break;
        case 'course.enrollment.deleted':
          await this.enrollmentService.deleteEnrollment(transaction.payload);
          break;
        default:
          throw new Error(`Event ${transaction.event} not implemented yet!`);
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  async persistComputeError(
    transaction: Transaction,
    error_message: string,
  ): Promise<ComputeError> {
    const { event, _id } = transaction;
    const err = await new this.computeErrorModel({
      event: event,
      message_id: _id,
      _id: uuidv4(),
      error_message: error_message,
      created_at: Date.now(),
    });
    return err.save();
  }
}
