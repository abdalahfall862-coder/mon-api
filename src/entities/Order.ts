import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPING = 'shipping',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

@Entity('orders')
export class Order {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  userId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Column({ type: 'json' })
  items: {
    productId: string;
    quantity: number;
    priceAtPurchase: number;
    name: string;
  }[];

  @Column({ type: 'json' })
  shippingAddress: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };

  @Column({ type: 'json', nullable: true })
  delivery: {
    type: string;
    cost: number;
    address: string;
    city: string;
    status: string;
  };

  @Column({ nullable: true })
  paymentMethod: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  phone: string;
  
}