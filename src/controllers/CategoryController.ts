import { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';
import { CreateCategoryDto } from '../dto/CreateCategoryDto';
import { validate } from 'class-validator';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = await this.categoryService.getCategoryById(req.params.id);  // ← string
      res.json(category);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = Object.assign(new CreateCategoryDto(), req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        res.status(400).json({ errors: errors.map(e => e.constraints) });
        return;
      }

      const category = await this.categoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = await this.categoryService.updateCategory(req.params.id, req.body);  // ← string
      res.json(category);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.categoryService.deleteCategory(req.params.id);  // ← string
      res.json({ message: 'Catégorie supprimée' });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };
}