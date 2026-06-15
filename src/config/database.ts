import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Product } from '../entities/Product';
import { Category } from '../entities/Category';
import { Cart } from '../entities/Cart';
import { Order } from '../entities/Order';
import { Delivery } from '../entities/Delivery';
import { Favorite } from '../entities/Favorite';

export const AppDataSource = new DataSource({
  type: 'mongodb',
  url: process.env.MONGO_URI || "mongodb://localhost:27017/mon-api",
  database: 'shopmate',
  synchronize: true,
  logging: false,
  entities: [User, Product, Category, Cart, Order, Delivery, Favorite],
});