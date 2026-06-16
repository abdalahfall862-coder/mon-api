import { Router } from 'express';
import { ReviewController } from '../controllers/ReviewController';

export function createReviewRoutes(controller: ReviewController) {
    const router = Router();

    router.post('/', (req, res, next) => controller.addReview(req, res, next));
    router.get('/shop', (req, res, next) => controller.getShopReviews(req, res, next));
    router.get('/product/:id', (req, res, next) => controller.getProductReviews(req, res, next));

    return router;
}