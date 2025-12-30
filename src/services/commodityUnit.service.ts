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
  CommodityUnitDto,
  CommodityUnitFilterDto,
  UpdateCommodityUnitDto,
} from 'src/dtos/commodityUnit.dto';
import { CommodityUnitRepository } from 'src/repositories/commodityUnits.repository';
import { CommodityUnit } from 'src/entities/CommodityUnit.entity';

@Injectable()
export class CommodityUnitService {
  constructor(private CommodityUnitRepository: CommodityUnitRepository) {}

  async createCommodityUnit(
    CommodityUnitDto: CommodityUnitDto,
  ): Promise<StandardResopnse<CommodityUnitDto>> {
    const existingCommodityUnit = await this.CommodityUnitRepository.findOne({
      name: CommodityUnitDto.name,
    });

    if (existingCommodityUnit) {
      throw new UnprocessableEntityException('Name Already Exists');
    }

    await this.CommodityUnitRepository.create(CommodityUnitDto);

    return {
      data: CommodityUnitDto,
      code: 200,
      message: 'Success',
    };
  }

  async updateCommodityUnit(
    id: number,
    updateCommodityUnitDto: UpdateCommodityUnitDto,
  ): Promise<StandardResopnse<UpdateCommodityUnitDto>> {
    const existingCommodityUnit = await this.CommodityUnitRepository.findOne({
      name: updateCommodityUnitDto.name,
    });

    if (existingCommodityUnit) {
      throw new UnprocessableEntityException('Name Already Exists');
    }

    await this.CommodityUnitRepository.update(id, updateCommodityUnitDto);

    return {
      data: updateCommodityUnitDto,
      code: 200,
      message: 'Success',
    };
  }

  async deleteCommodityUnit(
    id: string,
  ): Promise<StandardResopnse<DeleteResult>> {
    const existingCommodityUnit =
      await this.CommodityUnitRepository.findById(id);

    if (!existingCommodityUnit) {
      throw new NotFoundException('CommodityUnit Not found');
    }

    await this.CommodityUnitRepository.delete(id);

    return {
      data: null,
      code: 200,
      message: 'Success',
    };
  }

  async findCommodityUnits(
    paginationDto: PaginationDto,
    CommodityUnitFilterDto: CommodityUnitFilterDto,
  ): Promise<StandardResopnse<PaginatedRecordsDto<CommodityUnit>>> {
    const result = await this.CommodityUnitRepository.findAllCommodityUnits(
      paginationDto,
      CommodityUnitFilterDto,
    );

    return {
      data: result,
      code: 200,
      message: 'Success',
    };
  }
}
