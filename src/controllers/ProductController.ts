import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { CreateProductDto } from '../dto/CreateProductDto';
import { validate } from 'class-validator';

export class ProductController {
  constructor(private productService: ProductService) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const { categoryId, minPrice, maxPrice, search, page, limit } = req.query;
      const result = await this.productService.getAllProducts({
        categoryId: categoryId ? categoryId.toString() : undefined,  // ← .toString()
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        search: search as string,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined
      });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productService.getProductById(req.params.id);
      res.json(product);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = Object.assign(new CreateProductDto(), req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        res.status(400).json({
          errors: errors.map(e => ({
            property: e.property,
            constraints: e.constraints
          }))
        });
        return;
      }

      const product = await this.productService.createProduct(dto);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productService.updateProduct(req.params.id, req.body);
      res.json(product);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.productService.deleteProduct(req.params.id);
      res.json({ message: 'Produit supprimé' });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };
}