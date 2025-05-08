import { BaseEntity } from './BaseEntity.ts';

export interface SmsTemplate extends BaseEntity{
  enabled: boolean;
  message: string
}