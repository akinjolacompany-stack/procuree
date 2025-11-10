// import {
//   Entity,
//   Column,
//   PrimaryGeneratedColumn,
//   Index,
//   OneToMany,
//   ManyToOne,
// } from 'typeorm';
// import { Base } from './base';
// import { Group } from './group.entity';
// import { CommodityUnit } from './commodity_unit.entity';
// import { PriceVersion } from './price_version.entity';

// @Entity('commodities')
// @Index(['groupId', 'name'], { unique: true }) // one commodity name per group
// export class Commodity extends Base {
//   @PrimaryGeneratedColumn('uuid')
//   id!: string;

//   // 🔹 Multi-tenancy: belongs to one Group (Admin's market group)
//   @Column('uuid')
//   @Index()
//   groupId!: string;

//   @ManyToOne(() => Group, { onDelete: 'CASCADE' })
//   group!: Group;

//   // 🔹 Commodity name (e.g. "Onions", "Tomatoes")
//   @Column({ type: 'varchar', length: 100 })
//   name!: string;

//   // 🔹 Optional short or long description
//   @Column({ type: 'text', nullable: true })
//   description?: string;

//   // 🔹 Whether the commodity is active and available for ordering
//   @Column({ type: 'boolean', default: true })
//   isActive!: boolean;

//   // 🔹 Category (optional)
//   @Column({ type: 'varchar', length: 100, nullable: true })
//   category?: string;

//   // 🔹 Units allowed for this commodity (1:N)
//   @OneToMany(() => CommodityUnit, (u) => u.commodity, {
//     cascade: true,
//     eager: false,
//   })
//   units!: CommodityUnit[];

//   // 🔹 Price history (time-versioned)
//   @OneToMany(() => PriceVersion, (pv) => pv.commodity, {
//     cascade: true,
//     eager: false,
//   })
//   priceVersions!: PriceVersion[];
// }
