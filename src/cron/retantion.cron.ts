import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class RetantionCron {
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  deleteOldTransactions() {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  deleteOldTransactionErrors() {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  deleteOldComputeErrors() {}
}
