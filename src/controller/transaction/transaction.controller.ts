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
      await this.transactionService.createTransaction(createTransactionDto);
      return response.status(HttpStatus.OK);
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST);
    }
  }
}
