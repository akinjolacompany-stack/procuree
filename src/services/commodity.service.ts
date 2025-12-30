import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { StandardResopnse } from 'src/common';
import { PaginatedRecordsDto, PaginationDto } from 'src/dtos/pagination.dto';
import { DeleteResult } from 'typeorm';

import {
  CommodityDto,
  CommodityFilterDto,
  UpdateCommodityDto,
} from 'src/dtos/commodity.dto';
import { CommodityRepository } from 'src/repositories/commodity.repository';
import { Commodity } from 'src/entities/Commodity.entity';

import { CommodityUnitFilterDto } from 'src/dtos/commodityUnit.dto';
import { CommodityUnitRepository } from 'src/repositories/commodityUnits.repository';
import { CommodityUnit } from 'src/entities/commodityUnit.entity';

@Injectable()
export class CommodityService {
  constructor(
    private commodityRepository: CommodityRepository,
    private commodityUnitRepository: CommodityUnitRepository,
  ) {}

  async createCommodity(
    CommodityDto: CommodityDto,
  ): Promise<StandardResopnse<CommodityDto>> {
    const existingCommodity = await this.commodityRepository.findOne({
      name: CommodityDto.name,
    });

    if (existingCommodity) {
      throw new UnprocessableEntityException('Name Already Exists');
    }

    await this.commodityRepository.create(CommodityDto);

    return {
      data: CommodityDto,
      code: 200,
      message: 'Success',
    };
  }

  async updateCommodity(
    id: number,
    updateCommodityDto: UpdateCommodityDto,
  ): Promise<StandardResopnse<UpdateCommodityDto>> {
    const existingCommodity = await this.commodityRepository.findOne({
      name: updateCommodityDto.name,
    });

    if (existingCommodity) {
      throw new UnprocessableEntityException('Name Already Exists');
    }

    await this.commodityRepository.update(id, updateCommodityDto);

    return {
      data: updateCommodityDto,
      code: 200,
      message: 'Success',
    };
  }

  async deleteCommodity(id: string): Promise<StandardResopnse<DeleteResult>> {
    const existingCommodity = await this.commodityRepository.findById(id);

    if (!existingCommodity) {
      throw new NotFoundException('Commodity Not found');
    }

    await this.commodityRepository.delete(id);

    return {
      data: null,
      code: 200,
      message: 'Success',
    };
  }

  async findCommodities(
    paginationDto: PaginationDto,
    CommodityFilterDto: CommodityFilterDto,
  ): Promise<StandardResopnse<PaginatedRecordsDto<Commodity>>> {
    const result = (await this.commodityRepository.findAllCommodities(
      paginationDto,
      CommodityFilterDto,
    )) as PaginatedRecordsDto<Commodity>;

    return {
      data: result,
      code: 200,
      message: 'Success',
    };
  }

  async findCommodityUnits(
    paginationDto: PaginationDto,
    commodityUnitFilterDto: CommodityUnitFilterDto,
    commodityId: string,
  ): Promise<StandardResopnse<PaginatedRecordsDto<CommodityUnit>>> {
    const result = (await this.commodityUnitRepository.findAllCommodityUnits(
      paginationDto,
      commodityUnitFilterDto,
      commodityId,
    )) as PaginatedRecordsDto<CommodityUnit>;

    return {
      data: result,
      code: 200,
      message: 'Success',
    };
  }
}
