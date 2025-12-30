// request_item.entity.ts
import { Entity, Column, Index, ManyToOne, Unique } from 'typeorm';
import { Base } from './base';
import { Group } from './group.entity';
import { User } from './user.entity';
import { PurchasePeriod } from './purchasePeriod.entity';
import { PurchasePeriodItem } from './purchasePeriodItem.entity';

export enum RequestItemStatus {
  DRAFT = 'DRAFT', // behaves like "in cart", editable
  SUBMITTED = 'SUBMITTED', // user has explicitly submitted
  AWAITING_CONSENT = 'AWAITING_CONSENT',
  CONFIRMED = 'CONFIRMED', // consent sorted, ready for fulfillment
  CANCELLED = 'CANCELLED',
  PARTIALLY_FULFILLED = 'PARTIALLY_FULFILLED',
  FULFILLED = 'FULFILLED',
  UNFULFILLED = 'UNFULFILLED',
}

@Entity('request_items')
export class RequestItem extends Base {
  @Column('uuid')
  @Index()
  groupId!: string;

  @ManyToOne(() => Group, { onDelete: 'CASCADE' })
  group!: Group;

  // Which period (market run)
  @Column('uuid')
  @Index()
  purchasePeriodId!: string;

  @ManyToOne(() => PurchasePeriod, { onDelete: 'CASCADE' })
  purchasePeriod!: PurchasePeriod;

  // Which Procuree (user)
  @Column('uuid')
  @Index()
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;

  // Which period item (commodity + unit + price config)
  @Column('uuid')
  @Index()
  purchasePeriodItemId!: string;

  @ManyToOne(() => PurchasePeriodItem, { onDelete: 'RESTRICT' })
  purchasePeriodItem!: PurchasePeriodItem;

  // Quantity requested in that unit
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  requestedQty!: number;

  // Snapshot of price at time of last submit/consent
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  pricePerUnitAtRequest!: number;

  // Convenience: requestedQty * pricePerUnitAtRequest
  @Column({ type: 'decimal', precision: 14, scale: 2 })
  lineEstimatedTotal!: number;

  @Column({
    type: 'enum',
    enum: RequestItemStatus,
    default: RequestItemStatus.DRAFT,
  })
  status!: RequestItemStatus;
}
