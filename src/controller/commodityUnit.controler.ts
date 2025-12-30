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
  CommodityUnitDto,
  CommodityUnitFilterDto,
  UpdateCommodityUnitDto,
} from 'src/dtos/CommodityUnit.dto';
import { CommodityUnitService } from 'src/services/commodityUnit.service';
import { PaginatedRecordsDto, PaginationDto } from 'src/dtos/pagination.dto';
import { StandardResopnse } from 'src/common';
import { DeleteResult } from 'typeorm';
import { Roles } from 'src/decorators/roles.decorator';
import { CommodityUnit } from 'src/entities/commodityUnit.entity';

@Controller('CommodityUnit')
@ApiTags(SwaggerApiEnumTags.COMMODITYUNIT)
@Roles(RoleEnum.ADMIN)
@ApiBearerAuth()
export class CommodityUnitController {
  constructor(private readonly commodityUnitService: CommodityUnitService) {}

  @Post()
  createCommodityUnit(
    @Body() creatCommodityUnit: CommodityUnitDto,
  ): Promise<StandardResopnse<CommodityUnitDto>> {
    return this.commodityUnitService.createCommodityUnit(creatCommodityUnit);
  }

  @Patch(':id')
  updateCommodityUnit(
    @Body() updateCommodityUnit: UpdateCommodityUnitDto,
    @Param('id') id: number,
  ): Promise<StandardResopnse<UpdateCommodityUnitDto>> {
    return this.commodityUnitService.updateCommodityUnit(
      id,
      updateCommodityUnit,
    );
  }

  @Delete(':id')
  deleteCommodityUnit(
    @Param('id') id: string,
  ): Promise<StandardResopnse<DeleteResult>> {
    return this.commodityUnitService.deleteCommodityUnit(id);
  }

  @Get()
  async findCommodityUnit(
    @Query() paginationDto: PaginationDto,
    @Query() CommodityUnitFilterDto: CommodityUnitFilterDto,
  ): Promise<StandardResopnse<PaginatedRecordsDto<CommodityUnit>>> {
    return this.commodityUnitService.findCommodityUnits(
      paginationDto,
      CommodityUnitFilterDto,
    );
  }

  
}
