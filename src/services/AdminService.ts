import { DataSource } from 'typeorm';
import { OrderRepository } from '../repositories/OrderRepository';

export class AdminService {
  constructor(
    private orderRepo: OrderRepository,
    private dataSource: DataSource
  ) {}

  async getStats(): Promise<{
    users: number;
    products: number;
    orders: number;
    revenue: number;
  }> {
    const userRepo = this.dataSource.getRepository('User');
    const productRepo = this.dataSource.getRepository('Product');

    const users = await userRepo.count();
    const products = await productRepo.count();
    const orders = await this.orderRepo.count();
    const revenue = await this.orderRepo.getTotalRevenue();

    return { users, products, orders, revenue };
  }
}