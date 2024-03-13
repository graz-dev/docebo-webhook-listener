import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateTransactionPayloadDto {
  @IsDateString()
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

  @IsDateString()
  @IsNotEmpty()
  readonly enrollment_date: Date;

  @IsOptional()
  @IsDateString()
  readonly enrollment_date_begin_validity: Date | null;

  @IsOptional()
  @IsDateString()
  readonly enrollment_date_end_validity: Date | null;

  @IsNumber()
  readonly subscribed_by_id: number;

  @IsString()
  readonly status: string;
}
