import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CreateTransactionDto } from 'src/dto/create-transaction.dto';
import { TransactionService } from 'src/service/transaction/transaction.service';
import { ComputeService } from 'src/service/compute/compute.service';

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly computeService: ComputeService,
  ) {}

  @Post()
  async createTransaction(
    @Res() response,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    try {
      const newTransaction =
        await this.transactionService.createTransaction(createTransactionDto);
      this.computeService
        .compute(newTransaction)
        .then(() => console.log('EXECUTED'))
        .catch(() => console.error('ERROR'));
      return response.status(HttpStatus.OK).json({
        message: 'Transaction has been saved successfully',
        newTransaction,
      });
    } catch (err) {
      await this.transactionService.persistTransactionError(
        createTransactionDto,
        err.message,
      );
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Transaction not saved!',
        err,
      });
    }
  }
}
