// verification_code.entity.ts – ROOT (no groupId; verifies identity globally)
import { Entity, Column, Index } from 'typeorm';
import { Base } from './base';

export enum OtpPurpose {
  SIGN_UP = 'SIGN_UP',
  LOGIN = 'LOGIN',
}

export enum OtpChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
}

@Entity('verification_codes')
@Index('idx_verif_active', ['recipient', 'purpose', 'expiresAt'])
export class VerificationCode extends Base {
  @Column({ type: 'varchar', length: 255 }) recipient!: string;
  @Column({ type: 'varchar', length: 255 }) codeHash!: string;
  @Column({ type: 'enum', enum: OtpPurpose }) purpose!: OtpPurpose;
  @Column({ type: 'enum', enum: OtpChannel }) channel!: OtpChannel;
  @Column({ type: 'timestamptz' }) expiresAt!: Date;
  @Column({ type: 'boolean', default: false }) used!: boolean;
}


