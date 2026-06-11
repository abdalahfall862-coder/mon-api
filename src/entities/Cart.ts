import { Entity, ObjectIdColumn, Column, CreateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('carts')
export class Cart {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  userId: string;

  @Column({ type: 'json', default: [] })
  items: {
    productId: string;
    quantity: number;
    price: number;
    name: string;
    image: string;
  }[];

  @CreateDateColumn()
  updatedAt: Date;
}