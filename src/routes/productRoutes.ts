import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';

export const createProductRoutes = (controller: ProductController): Router => {
  const router = Router();

  router.get('/', controller.getAll);           // Public
  router.get('/:id', controller.getById);     // Public
  router.post('/', authMiddleware, adminMiddleware, controller.create);     // Admin
  router.put('/:id', authMiddleware, adminMiddleware, controller.update);   // Admin
  router.delete('/:id', authMiddleware, adminMiddleware, controller.delete); // Admin

  return router;
};