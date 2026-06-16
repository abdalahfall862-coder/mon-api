import { DataSource } from 'typeorm';
import { Review } from '../entities/Review';

export class ReviewRepository {
    private repo;

    constructor(dataSource: DataSource) {
        this.repo = dataSource.getRepository(Review);
    }

    async create(data: Partial<Review>) {
        const review = this.repo.create(data);
        return this.repo.save(review);
    }

    async findByProduct(productId: number) {
        return this.repo.find({ where: { productId, type: 'product' }, order: { createdAt: 'DESC' } });
    }

    async findByShop() {
        return this.repo.find({ where: { type: 'shop' }, order: { createdAt: 'DESC' } });
    }

    async delete(id: number) {
        return this.repo.delete(id);
    }
}