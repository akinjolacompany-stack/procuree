import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Trim } from 'src/decorators/trim.decorator';
import { BaseFilterDto } from './baseFilter.dto';

export class CommodityDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  categoryId: string;
  
}

export class UpdateCommodityDto extends PartialType(CommodityDto) {}

export class CommodityFilterDto extends BaseFilterDto {}

