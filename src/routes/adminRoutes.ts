import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';

export const createAdminRoutes = (controller: AdminController): Router => {
  const router = Router();

  router.get('/stats', authMiddleware, adminMiddleware, controller.getStats);

  return router;
};