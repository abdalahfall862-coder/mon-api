import { ReviewRepository } from '../repositories/ReviewRepository';

export class ReviewService {
    constructor(private reviewRepo: ReviewRepository) {}

    async addReview(data: {
        productId?: number;
        authorName: string;
        rating: number;
        title?: string;
        comment?: string;
        type: 'product' | 'shop';
    }) {
        if (!data.authorName) throw new Error('Nom requis');
        if (!data.rating || data.rating < 1 || data.rating > 5) throw new Error('Note entre 1 et 5 requise');
        if (data.type === 'product' && !data.productId) throw new Error('Produit requis');
        return this.reviewRepo.create(data);
    }

    async getProductReviews(productId: number) {
        const reviews = await this.reviewRepo.findByProduct(productId);
        const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
        return { reviews, average: Math.round(avg * 10) / 10, total: reviews.length };
    }

    async getShopReviews() {
        const reviews = await this.reviewRepo.findByShop();
        const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
        return { reviews, average: Math.round(avg * 10) / 10, total: reviews.length };
    }
}