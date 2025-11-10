import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export class Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at!: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  updated_at!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deleted_at?: Date | null;

  @Column({ nullable: true }) // Allows null and limits length to 10
  createdby: string;

  @Column({ nullable: true }) // Allows null and limits length to 10
  updatedby: string;
}
