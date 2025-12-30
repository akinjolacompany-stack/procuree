import {
  Entity,
  Column,
  Index,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Base } from './base';
import { Group } from './group.entity';
import { CommodityUnit } from './commodityUnit.entity';
import { Category } from './category.entity';

@Entity('commodities')
@Index(['groupId']) // one commodity name per group
export class Commodity extends Base {
  // 🔹 Multi-tenancy: belongs to one Group (Admin's market group)
  @Column('uuid')
  @Index()
  groupId!: string;

  @ManyToOne(() => Group, { onDelete: 'CASCADE' })
  group!: Group;

  // 🔹 Commodity name (e.g. "Onions", "Tomatoes")
  @Column({ type: 'varchar', length: 100 })
  name!: string;

  // 🔹 Optional short or long description
  @Column({ type: 'text', nullable: true })
  description?: string;

  // 🔹 Whether the commodity is active and available for ordering
  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  categoryId?: string | null;

  @ManyToOne(() => Category, { onDelete: 'SET NULL' })
  category?: Category | null;

  // 🔹 Units allowed for this commodity (1:N)
  @OneToMany(() => CommodityUnit, (u) => u.commodity, {
    cascade: true,
    eager: false,
  })
  units!: CommodityUnit[];
}
