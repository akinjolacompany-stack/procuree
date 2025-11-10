// src/modules/users/user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Group } from 'src/entities/group.entity';

@Injectable()
export class GroupRepository extends BaseRepository<Group> {
  constructor(
    @InjectDataSource() dataSource: DataSource,
    @InjectRepository(Group) repo: Repository<Group>,
  ) {
    super(dataSource, repo);
  }

  

  async findGroupByInviteCode(inviteCode: string) {
    return this.repo.findOne({ where: { inviteCode } });
  }
}
