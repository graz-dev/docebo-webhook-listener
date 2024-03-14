import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/schema/transaction.schema';
import { EnrollmentService } from '../enrollment/enrollment.service';

@Injectable()
export class ComputeService {
  constructor(private enrollmentService: EnrollmentService) {}

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
        default:
          throw new Error(`Event ${transaction.event} not implemented yet!`);
      }
    } catch (err) {
      throw new Error(err);
    }
  }
}
