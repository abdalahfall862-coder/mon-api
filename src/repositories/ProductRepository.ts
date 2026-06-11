import { Repository, DataSource } from 'typeorm';
import { Product } from '../entities/Product';

export class ProductRepository {
  private repo: Repository<Product>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Product);
  }

  async findAll(options: {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const query: any = { isActive: true };

    if (options.categoryId) query.categoryId = options.categoryId;
    if (options.minPrice || options.maxPrice) {
      query.price = {};
      if (options.minPrice) query.price.$gte = options.minPrice;
      if (options.maxPrice) query.price.$lte = options.maxPrice;
    }
    if (options.search) {
      query.$or = [
        { name: { $regex: options.search, $options: 'i' } },
        { description: { $regex: options.search, $options: 'i' } }
      ];
    }

    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.repo.find({ where: query, skip, take: limit, order: { createdAt: 'DESC' } }),
      this.repo.count({ where: query })
    ]);

    return { products, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: any): Promise<Product | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: Partial<Product>): Promise<Product> {
    const product = this.repo.create(data);
    return this.repo.save(product);
  }

  async update(id: any, data: Partial<Product>): Promise<Product | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: any): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected !== 0;
  }

  async decrementStock(id: any, quantity: number): Promise<boolean> {
    const product = await this.findById(id);
    if (!product) return false;
    product.stock -= quantity;
    await this.repo.save(product);
    return true;
  }
}