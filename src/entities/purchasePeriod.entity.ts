import {
  Entity,
  Column,
  Index,
  ManyToOne,
} from 'typeorm';
import { Base } from './base';
import { Group } from './group.entity';
import { PurchasePeriodStatus } from 'src/common/index.enum';


@Entity('purchase_periods')
@Index(['groupId', 'status'])
export class PurchasePeriod extends Base {
  @Column('uuid')
  @Index()
  groupId!: string;

  @ManyToOne(() => Group, { onDelete: 'CASCADE' })
  group!: Group;

  @Column({ type: 'varchar', length: 120 })
  name!: string; 
  // Example: "Saturday Run - Nov 22, 2025"
  // Or "Week 14 Market Run"

  @Column({ type: 'timestamptz' })
  startAt!: Date;
  // When requests can start

  @Column({ type: 'timestamptz' })
  endAt!: Date;
  // When requests stop (Procuree can't modify after this)

  @Column({
    type: 'enum',
    enum: PurchasePeriodStatus,
    default: PurchasePeriodStatus.DRAFT,
  })
  status!: PurchasePeriodStatus;

  @Column({ type: 'timestamptz', nullable: true })
  attachDeadline?: Date | null;
  // Optional: time Procurees must attach evidence of payment (future feature)

  @Column({ type: 'boolean', default: false })
  allocationsLocked!: boolean;
  // After Admin allocates items, prevent changes
}
