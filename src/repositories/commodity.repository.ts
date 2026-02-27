// src/modules/users/user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Group } from 'src/entities/group.entity';
import { Commodity } from 'src/entities/commodity.entity';
import { QueryBuilderHelper } from 'src/utils/queryBuilder.utils';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { CommodityFilterDto } from 'src/dtos/commodity.dto';

@Injectable()
export class CommodityRepository extends BaseRepository<Commodity> {
  constructor(
    @InjectDataSource() dataSource: DataSource,
    @InjectRepository(Commodity) repo: Repository<Commodity>,
  ) {
    super(dataSource, repo);
  }

  async findAllCommodities(
    options: PaginationDto,
    commodityFilterDto: CommodityFilterDto,
    categoryId?: string,
  ) {
    const qb = this.repo.createQueryBuilder('commodity');

    const helper = new QueryBuilderHelper(qb);

    helper
      .applyRelations([
        { alias: 'category', path: 'commodity.category' },
        { alias: 'commodityUnit', path: 'commodity.units' },
      ])
      .applySelect([
        'commodity',
        'category.id',
        'category.name',
        'commodityUnit.name',
        'commodityUnit.id',
        'commodityUnit.conversionFactor',
        'commodityUnit.baseUnitId',
      ])
      .applySearch({
        'commodity.name': commodityFilterDto.searchQuery,
      })
      .applySorting('commodity.created_at', options.sortOrder);

    if (categoryId) {
      helper.applyFilter({ 'commodity.commodityId': categoryId });
    }

    return helper.paginate(options, 'commodity');
  }
}
