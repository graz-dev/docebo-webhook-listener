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
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://cstgrzn:zseRFV0987@graziano-casto.kfghkpf.mongodb.net/?retryWrites=true&w=majority&appName=graziano-casto',
      {
        dbName: 'docebo-webhook-transactions',
      },
    ),
    MongooseModule.forFeature([
      { name: 'Transaction', schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
