// src/modules/users/user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Category } from 'src/entities/category.entity';
import { QueryBuilderHelper } from 'src/utils/queryBuilder.utils';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { UserFilterDto } from 'src/dtos/user.dto';

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
  constructor(
    @InjectDataSource() dataSource: DataSource,
    @InjectRepository(Category) repo: Repository<Category>,
  ) {
    super(dataSource, repo);
  }

  async findAllCategories(
    options: PaginationDto,
    userFilterDto: UserFilterDto,
  ) {
    const qb = this.repo.createQueryBuilder('category');

    const helper = new QueryBuilderHelper(qb);

    helper
      .applySearch({
        'category.name': userFilterDto.searchQuery,
      })
      .applySorting('category.created_at', options.sortOrder);

    return helper.paginate(options);
  }
}
