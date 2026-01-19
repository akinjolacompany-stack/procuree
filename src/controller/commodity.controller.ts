import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RoleEnum, SwaggerApiEnumTags } from '../common/index.enum';
import {
  CommodityDto,
  CommodityFilterDto,
  UpdateCommodityDto,
} from 'src/dtos/commodity.dto';
import { CommodityService } from 'src/services/commodity.service';
import { PaginatedRecordsDto, PaginationDto } from 'src/dtos/pagination.dto';
import { StandardResopnse } from 'src/common';
import { DeleteResult } from 'typeorm';
import { Roles } from 'src/decorators/roles.decorator';
import { Commodity } from 'src/entities/commodity.entity';
import { CommodityUnitFilterDto } from 'src/dtos/commodityUnit.dto';
import { CommodityUnit } from 'src/entities/commodityUnit.entity';

@Controller('Commodity')
@ApiTags(SwaggerApiEnumTags.COMMODITY)
@Roles(RoleEnum.ADMIN)
@ApiBearerAuth()
export class CommodityController {
  constructor(private readonly commodityService: CommodityService) {}

  @Post()
  createCommodity(
    @Body() creatCommodity: CommodityDto,
  ): Promise<StandardResopnse<CommodityDto>> {
    return this.commodityService.createCommodity(creatCommodity);
  }

  @Patch(':id')
  updateCommodity(
    @Body() updateCommodity: UpdateCommodityDto,
    @Param('id') id: number,
  ): Promise<StandardResopnse<UpdateCommodityDto>> {
    return this.commodityService.updateCommodity(id, updateCommodity);
  }

  @Delete(':id')
  deleteCommodity(
    @Param('id') id: string,
  ): Promise<StandardResopnse<DeleteResult>> {
    return this.commodityService.deleteCommodity(id);
  }

  @Get()
  async findCommodity(
    @Query() paginationDto: PaginationDto,
    @Query() CommodityFilterDto: CommodityFilterDto,
  ): Promise<StandardResopnse<PaginatedRecordsDto<Commodity>>> {
    return this.commodityService.findCommodities(
      paginationDto,
      CommodityFilterDto,
    );
  }

  @Get(':id/commodity-unit')
  async findCommodityUnit(
    @Query() paginationDto: PaginationDto,
    @Query() CommodityFilterDto: CommodityUnitFilterDto,
    @Param('id') commodityId: string,
  ): Promise<StandardResopnse<PaginatedRecordsDto<CommodityUnit>>> {
    return this.commodityService.findCommodityUnits(
      paginationDto,
      CommodityFilterDto,
      commodityId,
    );
  }
}
