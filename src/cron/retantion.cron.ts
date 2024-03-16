import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITransaction } from 'src/interface/transaction.interface';
import { ITransactionError } from 'src/interface/transactionError.interface';
import { IComputeError } from 'src/interface/computeError.interface';

enum RetentionType {
  RETENTION_TRANSACTIONS,
  RETENTION_TRANSACTION_ERRORS,
  RETENTION_COMPUTE_ERRORS,
}

@Injectable()
export class RetantionCron {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel('Transaction') private transactionModel: Model<ITransaction>,
    @InjectModel('TransactionError')
    private transactionErrorModel: Model<ITransactionError>,
    @InjectModel('ComputeError')
    private computeErrorModel: Model<IComputeError>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async deleteOldTransactions() {
    try {
      const cutoff = await this.getCutoffDate(
        RetentionType.RETENTION_TRANSACTIONS,
      );
      await this.transactionModel.deleteMany({ created_at: { $lt: cutoff } });
    } catch (err) {
      console.error(err.message);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async deleteOldTransactionErrors() {
    try {
      const cutoff = await this.getCutoffDate(
        RetentionType.RETENTION_TRANSACTION_ERRORS,
      );
      await this.transactionErrorModel.deleteMany({
        created_at: { $lt: cutoff },
      });
    } catch (err) {
      console.error(err.message);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async deleteOldComputeErrors() {
    try {
      const cutoff = await this.getCutoffDate(
        RetentionType.RETENTION_COMPUTE_ERRORS,
      );
      await this.computeErrorModel.deleteMany({
        created_at: { $lt: cutoff },
      });
    } catch (err) {
      console.error(err.message);
    }
  }

  private async getCutoffDate(type: RetentionType) {
    if (type === null) {
      throw new Error(`No "type" available getting retantion time.`);
    }
    switch (type) {
      case RetentionType.RETENTION_TRANSACTIONS:
        return this.computeCutoffDate('TRANSACTION_RETANTION');
      case RetentionType.RETENTION_TRANSACTION_ERRORS:
        return this.computeCutoffDate('TRANSACTION_ERROR_RETANTION');
      case RetentionType.RETENTION_COMPUTE_ERRORS:
        return this.computeCutoffDate('COMPUTE_ERROR_RETANTION');
    }
  }

  private async computeCutoffDate(type: string) {
    const config = this.configService.get<string>(type);
    if (config === null) {
      throw new Error(
        `Unable to retreive retantion config for "type": ${type}.`,
      );
    }

    const c = {
      duration: config.split('-')[0],
      period: config.split('-')[1],
    };

    if (c.duration === null || c.period === null) {
      throw new Error(`Retantion config malformed for "type": ${type}.`);
    }

    const cutoffDate = new Date();

    switch (c.period) {
      case 'D':
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(c.duration));
        break;
      case 'M':
        cutoffDate.setMonth(cutoffDate.getMonth() - parseInt(c.duration));
        break;
      case 'Y':
        cutoffDate.setFullYear(cutoffDate.getFullYear() - parseInt(c.duration));
        break;
    }

    return cutoffDate;
  }
}
