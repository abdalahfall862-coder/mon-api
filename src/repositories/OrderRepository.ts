import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from '../entities/Order';

export class OrderRepository {
  private repo: Repository<Order>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Order);
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async findAll(): Promise<Order[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: any): Promise<Order | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: Partial<Order>): Promise<Order> {
    const order = this.repo.create(data);
    return this.repo.save(order);
  }

  async updateStatus(id: any, status: OrderStatus): Promise<Order | null> {
    await this.repo.update(id, { status });
    return this.findById(id);
  }

  async count(): Promise<number> {
    return this.repo.count();
  }

  async getTotalRevenue(): Promise<number> {
    const result = await this.repo
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .where('order.status != :cancelled', { cancelled: 'cancelled' })
      .getRawOne();
    return Number(result?.total) || 0;
  }
}