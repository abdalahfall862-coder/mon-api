import { ProductRepository } from '../repositories/ProductRepository';
import { Product } from '../entities/Product';
import { CreateProductDto } from '../dto/CreateProductDto';

export class ProductService {
  constructor(private productRepo: ProductRepository) {}

  async getAllProducts(filters: {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return this.productRepo.findAll(filters);
  }

  async getProductById(id: any): Promise<Product> {
    const product = await this.productRepo.findById(id);
    if (!product) throw new Error('Produit non trouvé');
    return product;
  }

  async createProduct(dto: CreateProductDto): Promise<Product> {
    return this.productRepo.create({
      name: dto.name,
      description: dto.description,
      image: dto.image,
      price: dto.price,
      stock: dto.stock,
      categoryId: dto.categoryId.toString(),  // ← categoryId, pas category
      isActive: true
    });
  }

  async updateProduct(id: any, data: Partial<Product>): Promise<Product> {
    const product = await this.productRepo.update(id, data);
    if (!product) throw new Error('Produit non trouvé');
    return product;
  }

  async deleteProduct(id: any): Promise<void> {
    const deleted = await this.productRepo.delete(id);
    if (!deleted) throw new Error('Produit non trouvé');
  }
}