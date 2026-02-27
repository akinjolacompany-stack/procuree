import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { StandardResopnse } from 'src/common';
import { PaginatedRecordsDto, PaginationDto } from 'src/dtos/pagination.dto';
import { DeleteResult, Repository } from 'typeorm';

import {
  CommodityDto,
  CommodityFilterDto,
  CommodityUnitItemDto,
  UpdateCommodityDto,
} from 'src/dtos/commodity.dto';
import { CommodityRepository } from 'src/repositories/commodity.repository';
import { Commodity } from 'src/entities/commodity.entity';

import { CommodityUnitFilterDto } from 'src/dtos/commodityUnit.dto';
import { CommodityUnitRepository } from 'src/repositories/commodityUnits.repository';
import { CommodityUnit } from 'src/entities/commodityUnit.entity';
import { RequestContext } from 'src/common/context/requestContext';

@Injectable()
export class CommodityService {
  constructor(
    private commodityRepository: CommodityRepository,
    private commodityUnitRepository: CommodityUnitRepository,
  ) {}

  async createCommodity(
    commodityDto: CommodityDto,
  ): Promise<StandardResopnse<CommodityDto>> {
    const groupId = RequestContext.get('groupId');
    if (!groupId) {
      throw new UnauthorizedException('Invalid Request Context');
    }

    const existingCommodity = await this.commodityRepository.findOne({
      name: commodityDto.name,
      groupId,
    });
    
    if (existingCommodity) throw new UnprocessableEntityException('Name Already Exists');

    await this.commodityUnitRepository.transaction(async (txRepo) => {
      const { commodityUnits, ...rest } = commodityDto;
      const commodityTxRepo = txRepo.manager.getRepository(Commodity);
      const commodityUnitTxRepo = txRepo.manager.getRepository(CommodityUnit);

      const commodity = commodityTxRepo.create({
        ...rest,
        groupId,
      });

      const commodityCreated = await commodityTxRepo.save(commodity);

      if (Array.isArray(commodityUnits) && commodityUnits.length > 0) {
        await this.saveCommodityUnits(
          commodityUnitTxRepo,
          commodityCreated.id,
          groupId,
          commodityUnits,
        );
      }
    });

    return {
      data: commodityDto,
      code: 200,
      message: 'Success',
    };
  }

  async updateCommodity(
    id: string,
    updateCommodityDto: UpdateCommodityDto,
  ): Promise<StandardResopnse<UpdateCommodityDto>> {
    const groupId = RequestContext.get('groupId');
    if (!groupId) {
      throw new UnauthorizedException('Invalid Request Context');
    }

    await this.commodityUnitRepository.transaction(async (txRepo) => {
      const commodityTxRepo = txRepo.manager.getRepository(Commodity);
      const commodityUnitTxRepo = txRepo.manager.getRepository(CommodityUnit);

      const existingCommodity = await commodityTxRepo.findOne({
        where: { id, groupId },
      });

      if (!existingCommodity) {
        throw new NotFoundException('Commodity Not found');
      }

      if (updateCommodityDto.name) {
        const duplicate = await commodityTxRepo.findOne({
          where: { name: updateCommodityDto.name, groupId },
        });

        if (duplicate && duplicate.id !== id) {
          throw new UnprocessableEntityException('Name Already Exists');
        }
      }

      const { commodityUnits, ...patch } = updateCommodityDto;

      if (Object.keys(patch).length > 0) {
        await commodityTxRepo.update(id, patch);
      }

      if (Array.isArray(commodityUnits)) {
        await commodityUnitTxRepo.delete({ commodityId: id, groupId });

        if (commodityUnits.length > 0) {
          await this.saveCommodityUnits(
            commodityUnitTxRepo,
            id,
            groupId,
            commodityUnits,
          );
        }
      }
    });

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

  private async saveCommodityUnits(
    commodityUnitTxRepo: Repository<CommodityUnit>,
    commodityId: string,
    groupId: string,
    commodityUnits: CommodityUnitItemDto[],
  ) {
    const baseUnitInput = commodityUnits.find((unit) => unit.isBaseUnit);
    if (!baseUnitInput) {
      throw new UnprocessableEntityException(
        'One base unit is required (set isBaseUnit: true)',
      );
    }

    const { isBaseUnit, ...basePayload } = baseUnitInput;
    const baseUnit = commodityUnitTxRepo.create({
      ...basePayload,
      commodityId,
      groupId,
      conversionFactor: basePayload.conversionFactor ?? 1,
      baseUnitId: null,
    });

    const baseUnitCreated = await commodityUnitTxRepo.save(baseUnit);
    const baseUnitId = baseUnitCreated.id;

    const derivedUnitsPayload = commodityUnits
      .filter((unit) => !unit.isBaseUnit)
      .map((unit) => {
        const { isBaseUnit, ...payload } = unit;
        return commodityUnitTxRepo.create({
          ...payload,
          commodityId,
          groupId,
          conversionFactor: payload.conversionFactor ?? 1,
          baseUnitId,
        });
      });

    if (derivedUnitsPayload.length > 0) {
      await commodityUnitTxRepo.save(derivedUnitsPayload);
    }
  }
}
