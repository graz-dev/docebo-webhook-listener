import {
  IsNotEmpty,
  IsDefined,
  IsNotEmptyObject,
  ValidateNested,
  IsString,
  IsObject,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTransactionPayloadDto } from './create-transactionpayload.dto';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  readonly event: string;

  @IsBoolean()
  readonly fired_by_batch_action: number;

  @IsString()
  @IsNotEmpty()
  readonly message_id: string;

  @IsObject()
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateTransactionPayloadDto)
  readonly payload: CreateTransactionPayloadDto;
}
