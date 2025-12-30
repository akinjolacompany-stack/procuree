import { Entity, Column, ManyToOne, Index, OneToMany } from 'typeorm';
import { Base } from './base';
import { Commodity } from './commodity.entity';
import { UnitType } from 'src/common/index.enum';

@Entity('commodity_units')
// @Unique('uq_unit_per_commodity', ['commodityId'])
export class CommodityUnit extends Base {
  @Column('uuid')
  @Index()
  groupId!: string;

  @Column('uuid')
  @Index()
  commodityId!: string;

  @ManyToOne(() => Commodity, (c) => c.units, {
    onDelete: 'CASCADE',
  })
  commodity!: Commodity;

  @Column({ type: 'enum', enum: UnitType })
  type!: UnitType;

  // e.g. "kg", "bag", "crate", "litre"
  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minQty?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxQty?: number;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 4, default: 1 })
  conversionFactor!: number;


  @ManyToOne(() => CommodityUnit, (unit) => unit.derivedUnits, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  baseUnit?: CommodityUnit;

  @Column({ type: 'uuid', nullable: true })
  baseUnitId?: string;

  @OneToMany(() => CommodityUnit, (unit) => unit.baseUnit)
  derivedUnits?: CommodityUnit[];
}
