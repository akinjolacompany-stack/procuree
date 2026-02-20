// src/modules/users/user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { RequestItem } from 'src/entities/requestItem.entity';
import { QueryBuilderHelper } from 'src/utils/queryBuilder.utils';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { RequestItemFilterDto } from 'src/dtos/requestItem.dto';

@Injectable()
export class RequestItemRepository extends BaseRepository<RequestItem> {
  constructor(
    @InjectDataSource() dataSource: DataSource,
    @InjectRepository(RequestItem) repo: Repository<RequestItem>,
  ) {
    super(dataSource, repo);
  }

  async findAllRequestItems(
    options: PaginationDto,
    requestItemFilterDto: RequestItemFilterDto,
    requestId?: string,
  ) {
    const qb = this.repo.createQueryBuilder('requestItem');

    const helper = new QueryBuilderHelper(qb);

    helper
      // .applySearch({
      //   'requestItem.name': requestItemFilterDto.searchQuery,
      // })
      .applySorting('requestItem.created_at', options.sortOrder);

    if (requestId) {
      helper.applyFilter({
        'requestItem.requestId': requestId,
      });
    }

    return helper.paginate(options);
  }
}
