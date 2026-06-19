import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';

export const createAdminRoutes = (controller: AdminController): Router => {
  const router = Router();

  const auth = [authMiddleware, adminMiddleware];

  // Stats
  router.get('/stats', ...auth, controller.getStats);

  // Produits
  router.get('/products', ...auth, controller.getProducts);
  router.post('/products', ...auth, controller.createProduct);
  router.put('/products/:id', ...auth, controller.updateProduct);
  router.delete('/products/:id', ...auth, controller.deleteProduct);

  // Catégories
  router.get('/categories', ...auth, controller.getCategories);
  router.post('/categories', ...auth, controller.createCategory);
  router.delete('/categories/:id', ...auth, controller.deleteCategory);

  // Commandes
  router.get('/orders', ...auth, controller.getOrders);
  router.put('/orders/:id/status', ...auth, controller.updateOrderStatus);

  // Utilisateurs
  router.get('/users', ...auth, controller.getUsers);
  router.delete('/users/:id', ...auth, controller.deleteUser);

  return router;
};