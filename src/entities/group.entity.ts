// group.entity.ts – ROOT (no groupId)
import { Entity, Column, OneToMany, Unique, Index } from 'typeorm';
import { Base } from './base';
import { UserGroup } from './user_group.entity';

@Entity('groups')
@Unique('uq_group_name', ['name'])
export class Group extends Base {
  @Column({ type: 'varchar', length: 100 }) name!: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 12, nullable: true })
  @Index('idx_groups_invite_code')
  inviteCode?: string;

  // inverse must point to ug.group
  @OneToMany(() => UserGroup, (ug) => ug.group, { cascade: false })
  memberships!: UserGroup[];
}
