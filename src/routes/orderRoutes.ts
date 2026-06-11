import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';

export const createOrderRoutes = (controller: OrderController): Router => {
  const router = Router();

  router.post('/', authMiddleware, controller.create);
  router.get('/my-orders', authMiddleware, controller.getMyOrders);
  router.get('/all', authMiddleware, adminMiddleware, controller.getAllOrders);
  router.get('/:id', authMiddleware, controller.getById);
  router.put('/:id/status', authMiddleware, adminMiddleware, controller.updateStatus);

  return router;
};