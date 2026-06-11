import { Repository, DataSource } from 'typeorm';
import { Category } from '../entities/Category';

export class CategoryRepository {
  private repo: Repository<Category>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Category);
  }

  async findAll(): Promise<Category[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: any): Promise<Category | null> {  // ← any au lieu de number
    return this.repo.findOne({ where: { id } });
  }

  async create(data: Partial<Category>): Promise<Category> {
    const category = this.repo.create(data);
    return this.repo.save(category);
  }

  async update(id: any, data: Partial<Category>): Promise<Category | null> {  // ← any
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: any): Promise<boolean> {  // ← any
    const result = await this.repo.delete(id);
    return result.affected !== 0;
  }
}