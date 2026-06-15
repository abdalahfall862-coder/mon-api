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
    const page  = options.page  || 1;
    const limit = options.limit || 10;
    const skip  = (page - 1) * limit;

    // Récupérer tous les produits actifs
    let products = await this.repo.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' }
    });

    // Filtres côté JS (plus fiable avec TypeORM+MongoDB)
    if (options.categoryId) {
      products = products.filter(p => p.categoryId === options.categoryId);
    }
    if (options.minPrice) {
      products = products.filter(p => Number(p.price) >= Number(options.minPrice));
    }
    if (options.maxPrice) {
      products = products.filter(p => Number(p.price) <= Number(options.maxPrice));
    }
    if (options.search) {
      const s = options.search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(s) ||
        p.description?.toLowerCase().includes(s)
      );
    }

    const total    = products.length;
    const paginated = products.slice(skip, skip + limit);

    return { products: paginated, total, page, totalPages: Math.ceil(total / limit) };
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