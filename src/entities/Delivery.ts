import { Entity, ObjectIdColumn, Column, CreateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

export enum DeliveryType {
  PICKUP = 'pickup',
  YANGO = 'yango',
  EXPRESS = 'express',
  STANDARD = 'standard'
}

@Entity('deliveries')
export class Delivery {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  orderId: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column({ default: 'standard' })
  deliveryType: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cost: number;

  @Column({ default: 'preparing' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}