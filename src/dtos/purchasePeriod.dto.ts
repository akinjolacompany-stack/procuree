import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Trim } from 'src/decorators/trim.decorator';
import { BaseFilterDto } from './baseFilter.dto';

export class PurchasePeriodDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  startAt: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  endAt: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  attachDeadline: string;
}

export class UpdatePurchasePeriodDto extends PartialType(PurchasePeriodDto) {}

export class PurchasePeriodFilterDto extends BaseFilterDto {}
