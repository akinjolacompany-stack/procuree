import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { BaseFilterDto } from './baseFilter.dto';
import { MaxGreaterThanMin } from 'src/decorators/maxGreaterThanMin.decorator';

export class RequestItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  purchasePeriodId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  purchasePeriodItemId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  requestedQty: number;

  ifPriceHigherAction: string;

  ifPriceLowerAction: string;
}

export class UpdateRequestItemDto extends PartialType(RequestItemDto) {}

export class RequestItemFilterDto extends BaseFilterDto {}
