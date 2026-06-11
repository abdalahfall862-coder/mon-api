import { Router } from 'express';
import { CartController } from '../controllers/CartController';
import { authMiddleware } from '../middleware/auth';

export const createCartRoutes = (controller: CartController): Router => {
  const router = Router();

  router.get('/', authMiddleware, controller.getCart);
  router.post('/add', authMiddleware, controller.addToCart);
  router.put('/:itemId', authMiddleware, controller.updateQuantity);
  router.delete('/:itemId', authMiddleware, controller.removeFromCart);
  router.delete('/', authMiddleware, controller.clearCart);

  return router;
};