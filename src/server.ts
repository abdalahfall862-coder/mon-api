import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';

// Repositories
import { ProductRepository } from './repositories/ProductRepository';
import { CategoryRepository } from './repositories/CategoryRepository';
import { CartRepository } from './repositories/CartRepository';
import { OrderRepository } from './repositories/OrderRepository';
import { FavoriteRepository } from './repositories/FavoriteRepository';

// Services
import { ProductService } from './services/ProductService';
import { CategoryService } from './services/CategoryService';
import { CartService } from './services/CartService';
import { OrderService } from './services/OrderService';
import { AdminService } from './services/AdminService';
import { FavoriteService } from './services/FavoriteService';

// Controllers
import { ProductController } from './controllers/ProductController';
import { CategoryController } from './controllers/CategoryController';
import { CartController } from './controllers/CartController';
import { OrderController } from './controllers/OrderController';
import { AdminController } from './controllers/AdminController';
import { FavoriteController } from './controllers/FavoriteController';

// Routes
import { createProductRoutes } from './routes/productRoutes';
import { createCategoryRoutes } from './routes/categoryRoutes';
import { createCartRoutes } from './routes/cartRoutes';
import { createOrderRoutes } from './routes/orderRoutes';
import { createAdminRoutes } from './routes/adminRoutes';
import { createFavoriteRoutes } from './routes/favoriteRoutes';

dotenv.config();

const app = express();

// CORS pour autoriser le frontend
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:61721', 'http://127.0.0.1:61721'],
  credentials: true
}));

app.use(express.json());

// Connexion DB
AppDataSource.initialize()
  .then((dataSource: any) => {
    console.log('✅ Base de données connectée');

    // Repositories
    const productRepo = new ProductRepository(dataSource);
    const categoryRepo = new CategoryRepository(dataSource);
    const cartRepo = new CartRepository(dataSource);
    const orderRepo = new OrderRepository(dataSource);
    const favoriteRepo = new FavoriteRepository(dataSource);

    // Services
    const productService = new ProductService(productRepo);
    const categoryService = new CategoryService(categoryRepo);
    const cartService = new CartService(cartRepo, productRepo);
    const orderService = new OrderService(orderRepo, cartRepo, productRepo, dataSource);
    const adminService = new AdminService(orderRepo, dataSource);
    const favoriteService = new FavoriteService(favoriteRepo);

    // Controllers
    const productController = new ProductController(productService);
    const categoryController = new CategoryController(categoryService);
    const cartController = new CartController(cartService);
    const orderController = new OrderController(orderService);
    const adminController = new AdminController(adminService);
    const favoriteController = new FavoriteController(favoriteService);

    // Routes
    app.use('/api/products', createProductRoutes(productController));
    app.use('/api/categories', createCategoryRoutes(categoryController));
    app.use('/api/cart', createCartRoutes(cartController));
    app.use('/api/orders', createOrderRoutes(orderController));
    app.use('/api/admin', createAdminRoutes(adminController));
    app.use('/api/favorites', createFavoriteRoutes(favoriteController));

    // Health check
    app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // 404
    app.use((req, res) => {
      res.status(404).json({ error: 'Route non trouvée' });
    });

    // Erreurs
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('❌ Erreur:', err);
      res.status(500).json({ error: 'Erreur serveur interne' });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 MethShop API démarrée sur http://localhost:${PORT}`);
    });

  })
  .catch((error: any) => {
    console.error('❌ Erreur DB:', error);
    process.exit(1);
  });