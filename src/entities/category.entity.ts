// category.entity.ts
import { Entity, Column, Index, ManyToOne, OneToMany, Unique } from 'typeorm';
import { Base } from './base';
import { Group } from './group.entity';

@Entity('categories')
// @Unique('uq_category_name_per_parent_per_group', [
//   'groupId',
//   'parentCategoryId',
// ])
@Index(['groupId', 'parentCategoryId'])
export class Category extends Base {
  @Column('uuid')
  @Index()
  groupId!: string;

  @ManyToOne(() => Group, { onDelete: 'CASCADE' })
  group!: Group;

  @Column({ type: 'uuid', nullable: true })
  parentCategoryId?: string | null;

  @ManyToOne(() => Category, (c) => c.categories, { onDelete: 'CASCADE' })
  parent?: Category | null;

  @OneToMany(() => Category, (c) => c.parent)
  categories!: Category[];

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;


  @Column({ type: 'int', default: 0 })
  sortOrder!: number;
}
