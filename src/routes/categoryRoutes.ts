import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';

export const createCategoryRoutes = (controller: CategoryController): Router => {
  const router = Router();

  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.post('/', authMiddleware, adminMiddleware, controller.create);
  router.put('/:id', authMiddleware, adminMiddleware, controller.update);
  router.delete('/:id', authMiddleware, adminMiddleware, controller.delete);

  return router;
};