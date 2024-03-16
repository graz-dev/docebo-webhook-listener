import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { TransactionController } from './controller/transaction/transaction.controller';
import { TransactionService } from './service/transaction/transaction.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionSchema } from './schema/transaction.schema';
import { TransactionErrorSchema } from './schema/transactionError.schema';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnrollmentService } from './service/enrollment/enrollment.service';
import { EnrollmentSchema } from './schema/enrollment.schema';
import { ComputeService } from './service/compute/compute.service';
import { ComputeErrorSchema } from './schema/computeError.schema';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: configService.get<string>('DB_NAME'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'Transaction', schema: TransactionSchema },
      { name: 'TransactionError', schema: TransactionErrorSchema },
      { name: 'Enrollment', schema: EnrollmentSchema },
      { name: 'ComputeError', schema: ComputeErrorSchema },
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, EnrollmentService, ComputeService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
