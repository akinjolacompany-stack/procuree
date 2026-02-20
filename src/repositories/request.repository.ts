// src/modules/users/user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Request } from 'src/entities/request.entity';
import { QueryBuilderHelper } from 'src/utils/queryBuilder.utils';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { RequestFilterDto } from 'src/dtos/request.dto';

@Injectable()
export class RequestRepository extends BaseRepository<Request> {
  constructor(
    @InjectDataSource() dataSource: DataSource,
    @InjectRepository(Request) repo: Repository<Request>,
  ) {
    super(dataSource, repo);
  }

  async findAllRequests(
    options: PaginationDto,
    RequestFilterDto: RequestFilterDto,
  ) {
    const qb = this.repo.createQueryBuilder('Request');

    const helper = new QueryBuilderHelper(qb);

    helper

      .applySearch({
        'Request.name': RequestFilterDto.searchQuery,
      })
      .applySorting('Request.created_at', options.sortOrder);

    return helper.paginate(options);
  }
}
