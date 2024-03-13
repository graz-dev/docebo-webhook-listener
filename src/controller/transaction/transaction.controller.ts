import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CreateTransactionDto } from 'src/dto/create-transaction.dto';
import { TransactionService } from 'src/service/transaction/transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction(
    @Res() response,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    try {
      const newTransaction =
        await this.transactionService.createTransaction(createTransactionDto);
      return response.status(HttpStatus.OK).json({
        message: 'Transaction has been saved successfully',
        newTransaction,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Transaction not saved!',
        err,
      });
    }
  }
}
