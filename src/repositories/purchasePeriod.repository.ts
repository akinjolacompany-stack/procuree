// src/modules/users/user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { PurchasePeriod } from 'src/entities/purchasePeriod.entity';
import { QueryBuilderHelper } from 'src/utils/queryBuilder.utils';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { PurchasePeriodFilterDto } from 'src/dtos/purchasePeriod.dto';

@Injectable()
export class PurchasePeriodRepository extends BaseRepository<PurchasePeriod> {
  constructor(
    @InjectDataSource() dataSource: DataSource,
    @InjectRepository(PurchasePeriod) repo: Repository<PurchasePeriod>,
  ) {
    super(dataSource, repo);
  }

  async findAllpurchasePeriods(
    options: PaginationDto,
    PurchasePeriodFilterDto: PurchasePeriodFilterDto,
  ) {
    const qb = this.repo.createQueryBuilder('purchasePeriod');

    const helper = new QueryBuilderHelper(qb);

    helper

      .applySearch({
        'purchasePeriod.name': PurchasePeriodFilterDto.searchQuery,
      })
      .applySorting('purchasePeriod.created_at', options.sortOrder);

    return helper.paginate(options);
  }
}
