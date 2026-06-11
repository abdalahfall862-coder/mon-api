import { Entity, ObjectIdColumn, Column, CreateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('categories')
export class Category {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn()
  createdAt: Date;
}