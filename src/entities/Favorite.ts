import { Entity, ObjectIdColumn, Column, CreateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('favorites')
export class Favorite {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  userId: string;

  @Column()
  productId: string;

  @CreateDateColumn()
  createdAt: Date;
}