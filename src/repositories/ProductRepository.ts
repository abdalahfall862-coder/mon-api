import { Repository, DataSource } from 'typeorm';
import { Product } from '../entities/Product';
import { ObjectId } from 'mongodb';

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
    const page  = options.page  || 1;
    const limit = options.limit || 10;
    const skip  = (page - 1) * limit;

    let products = await this.repo.find({ order: { createdAt: 'DESC' } });
    products = products.filter(p => p.isActive !== false);

    if (options.categoryId) products = products.filter(p => p.categoryId === options.categoryId);
    if (options.minPrice)   products = products.filter(p => Number(p.price) >= Number(options.minPrice));
    if (options.maxPrice)   products = products.filter(p => Number(p.price) <= Number(options.maxPrice));
    if (options.search) {
      const s = options.search.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(s) || p.description?.toLowerCase().includes(s));
    }

    const total     = products.length;
    const paginated = products.slice(skip, skip + limit);
    return { products: paginated, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: any): Promise<Product | null> {
    try {
      // Chercher par string id dans tous les produits
      const all = await this.repo.find();
      return all.find(p => p.id.toString() === id.toString()) || null;
    } catch {
      return null;
    }
  }

  async create(data: Partial<Product>): Promise<Product> {
    const product = this.repo.create(data);
    return this.repo.save(product);
  }

  async update(id: any, data: Partial<Product>): Promise<Product | null> {
    const product = await this.findById(id);
    if (!product) return null;
    Object.assign(product, data);
    return this.repo.save(product);
  }

  async delete(id: any): Promise<boolean> {
    const product = await this.findById(id);
    if (!product) return false;
    await this.repo.remove(product);
    return true;
  }

  async decrementStock(id: any, quantity: number): Promise<boolean> {
    const product = await this.findById(id);
    if (!product) return false;
    product.stock -= quantity;
    await this.repo.save(product);
    return true;
  }
}