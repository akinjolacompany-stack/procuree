// src/modules/users/user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { QueryBuilderHelper } from 'src/utils/queryBuilder.utils';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { CommodityUnit } from 'src/entities/commodityUnit.entity';
import { CommodityUnitFilterDto } from 'src/dtos/commodityUnit.dto';

@Injectable()
export class CommodityUnitRepository extends BaseRepository<CommodityUnit> {
  constructor(
    @InjectDataSource() dataSource: DataSource,
    @InjectRepository(CommodityUnit) repo: Repository<CommodityUnit>,
  ) {
    super(dataSource, repo);
  }

  async findAllCommodityUnits(
    options: PaginationDto,
    commodityFilterDto: CommodityUnitFilterDto,
    commodityId?: string,
  ) {
    const qb = this.repo.createQueryBuilder('commodityUnit');

    const helper = new QueryBuilderHelper(qb);

    helper
      .applySearch({
        'commodityUnit.name': commodityFilterDto.searchQuery,
      })
      .applySorting('commodityUnit.created_at', options.sortOrder);

    if (commodityId) {
      helper.applyFilter({ 'commodityUnit.commodityId': commodityId });
    }

    return helper.paginate(options);
  }
}
