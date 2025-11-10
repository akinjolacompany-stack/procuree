// src/modules/users/user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { UserGroup } from 'src/entities/user_group.entity';
import { Role } from 'src/common/index.enum';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { UserFilterDto } from 'src/dtos/user.dto';
import { QueryBuilderHelper } from 'src/utils/queryBuilder.utils';

@Injectable()
export class UserGroupRepository extends BaseRepository<UserGroup> {
  constructor(
    @InjectDataSource() dataSource: DataSource,
    @InjectRepository(UserGroup) repo: Repository<UserGroup>,
  ) {
    super(dataSource, repo);
  }

  async findAllUsers(options: PaginationDto, userFilterDto: UserFilterDto) {
    const qb = this.repo.createQueryBuilder('user_groups');

    const helper = new QueryBuilderHelper(qb);

    helper
      .applyRelations([
        { alias: 'user', path: 'user_groups.user' },
        { alias: 'group', path: 'user_groups.group' },
      ])
      .applyFilter({
        'user_groups.role': Role.PROCUREE,
      })
      .applySelect([
        'user.id',
        'user.firstName',
        'user.email',
        'user.created_at',
        'group.id',
        'user_groups.id',
        'user_groups.role',
      ])
      .applySearch({
        'user.firstName': userFilterDto.searchQuery,
        'user.email': userFilterDto.searchQuery,
      })
      .applySorting('user.created_at', options.sortOrder);

    return helper.paginate(options, 'user_groups');
  }

  async findUserGroupByEmailAndRole(
    email: string,
    role: Role,
    groupId?: string,
  ) {
    const _where = { user: { email }, role };
    return this.repo.findOne({
      where: groupId ? { ..._where, groupId } : _where, // nested where on relation
      relations: ['user'], // load the relations you need
    });
  }
}
