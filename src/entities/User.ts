import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

export enum UserRole {
  CUSTOMER = 'customer',
  SELLER = 'seller',
  ADMIN = 'admin',
  DELIVERY = 'delivery'
}

@Entity('users')
export class User {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: UserRole.CUSTOMER })
  role: UserRole;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'json', nullable: true })
  address: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}