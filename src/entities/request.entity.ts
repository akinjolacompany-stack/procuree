import { Entity, Column, Index, ManyToOne, OneToMany, Unique } from 'typeorm';
import { Base } from './base';
import { Group } from './group.entity';
import { User } from './user.entity';
import { PurchasePeriod } from './purchasePeriod.entity';
import { RequestItem } from './requestItem.entity';

export enum RequestStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  CANCELLED = 'CANCELLED',
  CONFIRMED = 'CONFIRMED',
}

@Entity('requests')
@Unique(['groupId', 'purchasePeriodId', 'userId'])
export class Request extends Base {
  @Column('uuid')
  @Index()
  groupId!: string;

  @ManyToOne(() => Group, { onDelete: 'CASCADE' })
  group!: Group;

  

  @Column('uuid')
  @Index()
  purchasePeriodId!: string;

  @ManyToOne(() => PurchasePeriod, { onDelete: 'CASCADE' })
  purchasePeriod!: PurchasePeriod;

  @Column('uuid')
  @Index()
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;

  @Column({ type: 'int', default: 0 })
  totalItems!: number;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  totalEstimatedCost!: number;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.DRAFT,
  })
  status!: RequestStatus;

  @OneToMany(() => RequestItem, (item) => item.request)
  items!: RequestItem[];
}
