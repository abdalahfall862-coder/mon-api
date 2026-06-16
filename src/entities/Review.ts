import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Product } from './Product';

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    productId: number | null; // null = avis sur la boutique

    @Column({ nullable: true })
    @ManyToOne(() => Product, { nullable: true, onDelete: 'CASCADE' })
    product: Product | null;

    @Column()
    authorName: string; // nom libre, pas besoin de compte

    @Column({ type: 'int' })
    rating: number; // 1 à 5

    @Column({ nullable: true })
    title: string;

    @Column({ type: 'text', nullable: true })
    comment: string;

    @Column({ default: 'product' })
    type: 'product' | 'shop'; // produit ou boutique

    @CreateDateColumn()
    createdAt: Date;
}