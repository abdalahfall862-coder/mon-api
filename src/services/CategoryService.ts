import { CategoryRepository } from '../repositories/CategoryRepository';
import { Category } from '../entities/Category';

export class CategoryService {
  constructor(private categoryRepo: CategoryRepository) {}

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepo.findAll();
  }

  async getCategoryById(id: any): Promise<Category> {  // ← any
    const category = await this.categoryRepo.findById(id);
    if (!category) throw new Error('Catégorie non trouvée');
    return category;
  }

  async createCategory(data: Partial<Category>): Promise<Category> {
    return this.categoryRepo.create(data);
  }

  async updateCategory(id: any, data: Partial<Category>): Promise<Category> {  // ← any
    const category = await this.categoryRepo.update(id, data);
    if (!category) throw new Error('Catégorie non trouvée');
    return category;
  }

  async deleteCategory(id: any): Promise<void> {  // ← any
    const deleted = await this.categoryRepo.delete(id);
    if (!deleted) throw new Error('Catégorie non trouvée');
  }
}