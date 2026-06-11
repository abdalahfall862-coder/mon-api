import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('products')
export class Product {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  image: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column()
  categoryId: string;  // ← Référence manuelle (string de ObjectId)

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}