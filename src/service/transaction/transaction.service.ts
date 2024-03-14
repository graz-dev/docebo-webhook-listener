import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTransactionDto } from 'src/dto/create-transaction.dto';
import { ITransaction } from 'src/interface/transaction.interface';
import { Model } from 'mongoose';
import { ITransactionError } from 'src/interface/transactionError.interface';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from 'src/schema/transaction.schema';
import { TransactionError } from 'src/schema/transactionError.schema';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel('Transaction') private transactionModel: Model<ITransaction>,
    @InjectModel('TransactionError')
    private transactionErrorModel: Model<ITransactionError>,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const { message_id: _id, ...rest } = createTransactionDto;
    const t = { ...rest, _id };
    const newTransaction = await new this.transactionModel(t);
    return newTransaction.save();
  }

  async persistTransactionError(
    createTransactionDto: CreateTransactionDto,
    error_message: string,
  ): Promise<TransactionError> {
    const { event, message_id } = createTransactionDto;
    const err = await new this.transactionErrorModel({
      event,
      message_id,
      _id: uuidv4(),
      error_message: error_message,
    });
    return err.save();
  }
}
