import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { Trim } from 'src/decorators/trim.decorator';
import { BaseFilterDto } from './baseFilter.dto';
import { MaxGreaterThanMin } from 'src/decorators/maxGreaterThanMin.decorator';

export class PurchasePeriodItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  pricePerUnit: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @ValidateIf((_, value) => value !== null)
  @Min(1)
  minQty: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @ValidateIf((_, value) => value !== null)
  @MaxGreaterThanMin('minQty', {
    message: 'maxQty must be greater than or equal to minQty',
  })
  maxQty: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  commodityUnitId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  commodityId: string;
}

export class UpdatePurchasePeriodItemDto extends PartialType(
  PurchasePeriodItemDto,
) {}

export class PurchasePeriodItemFilterDto extends BaseFilterDto {}
