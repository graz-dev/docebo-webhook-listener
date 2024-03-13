import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTransactionDto } from 'src/dto/create-transaction.dto';
import { ITransaction } from 'src/interface/transaction.interface';
import { Model } from 'mongoose';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel('Transaction') private transactionModel: Model<ITransaction>,
  ) {}

  async createTransaction(createTransactionDto: CreateTransactionDto) {
    const newTransaction = await new this.transactionModel(
      createTransactionDto,
    );
    newTransaction.save();
  }
}
