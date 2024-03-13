import { IsDate, IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateTransactionPayloadDto {
  @IsDate()
  readonly fired_at: Date;

  @IsNumber()
  @IsNotEmpty()
  readonly user_id: number;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsNumber()
  @IsNotEmpty()
  readonly course_id: number;

  @IsString()
  @IsNotEmpty()
  readonly course_name: string;

  @IsString()
  readonly level: string;

  @IsDate()
  @IsNotEmpty()
  readonly enrollment_date: Date;

  @IsDate()
  readonly enrollment_date_begin_validity: Date | null;

  @IsDate()
  readonly enrollment_date_end_validity: Date | null;

  @IsNumber()
  readonly subscribed_by_id: number;

  @IsString()
  readonly status: string;
}
