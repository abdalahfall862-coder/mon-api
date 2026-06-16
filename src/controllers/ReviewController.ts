import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/ReviewService';

export class ReviewController {
    constructor(private reviewService: ReviewService) {}

    async addReview(req: Request, res: Response, next: NextFunction) {
        try {
            const review = await this.reviewService.addReview(req.body);
            return res.status(201).json(review);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async getProductReviews(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.reviewService.getProductReviews(Number(req.params.id));
            return res.json(data);
        } catch (error: any) {
            next(error);
        }
    }

    async getShopReviews(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.reviewService.getShopReviews();
            return res.json(data);
        } catch (error: any) {
            next(error);
        }
    }
}