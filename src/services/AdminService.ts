import { DataSource } from 'typeorm';
import { OrderRepository } from '../repositories/OrderRepository';

export class AdminService {
  constructor(
    private orderRepo: OrderRepository,
    private dataSource: DataSource
  ) {}

  // ── Stats ──────────────────────────────────────
  async getStats() {
    const userRepo    = this.dataSource.getRepository('User');
    const productRepo = this.dataSource.getRepository('Product');
    const users    = await userRepo.count();
    const products = await productRepo.count();
    const orders   = await this.orderRepo.count();
    const revenue  = await this.orderRepo.getTotalRevenue();
    return { users, products, orders, revenue };
  }

  // ── Produits ───────────────────────────────────
  async getProducts() {
    return this.dataSource.getRepository('Product').find({ order: { createdAt: 'DESC' } });
  }

  async createProduct(data: any) {
    const repo    = this.dataSource.getRepository('Product');
    const product = repo.create(data);
    return repo.save(product);
  }

  async updateProduct(id: string, data: any) {
    const repo = this.dataSource.getRepository('Product');
    await repo.update(id, data);
    return repo.findOne({ where: { id } });
  }

  async deleteProduct(id: string) {
    return this.dataSource.getRepository('Product').delete(id);
  }

  // ── Catégories ─────────────────────────────────
  async getCategories() {
    return this.dataSource.getRepository('Category').find();
  }

  async createCategory(data: any) {
    const repo     = this.dataSource.getRepository('Category');
    const category = repo.create(data);
    return repo.save(category);
  }

  async deleteCategory(id: string) {
    return this.dataSource.getRepository('Category').delete(id);
  }

  // ── Commandes ──────────────────────────────────
  async getOrders() {
    return this.dataSource.getRepository('Order').find({ 
        order: { createdAt: 'DESC' } 
    });
  }

  async updateOrderStatus(id: string, status: string) {
    const repo = this.dataSource.getRepository('Order');
    await repo.update(id, { status });
    return repo.findOne({ where: { id } });
  }

  // ── Utilisateurs ───────────────────────────────
  async getUsers() {
    const repo  = this.dataSource.getRepository('User');
    const users = await repo.find({ order: { createdAt: 'DESC' } });
    return users.map(({ password, ...u }: any) => u);
  }

  async deleteUser(id: string) {
    return this.dataSource.getRepository('User').delete(id);
  }
}