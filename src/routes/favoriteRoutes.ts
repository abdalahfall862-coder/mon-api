import { Router } from 'express';
import { FavoriteController } from '../controllers/FavoriteController';
import { authMiddleware } from '../middleware/auth';

export const createFavoriteRoutes = (controller: FavoriteController): Router => {
  const router = Router();

  router.get('/', authMiddleware, controller.getFavorites);
  router.post('/', authMiddleware, controller.addFavorite);
  router.delete('/:id', authMiddleware, controller.removeFavorite);

  return router;
};