import { CartRepository } from '../repositories/CartRepository';
import { ProductRepository } from '../repositories/ProductRepository';
import { Cart } from '../entities/Cart';

export class CartService {
  constructor(
    private cartRepo: CartRepository,
    private productRepo: ProductRepository
  ) {}

  async getCart(userId: string): Promise<Cart | null> {
    return this.cartRepo.findByUserId(userId);
  }

  async addToCart(userId: string, productId: string, quantity: number): Promise<Cart> {
    const product = await this.productRepo.findById(productId);
    if (!product) throw new Error('Produit non trouvé');
    if (product.stock < quantity) throw new Error(`Stock insuffisant. Disponible: ${product.stock}`);

    let cart = await this.cartRepo.findByUserId(userId);
    const items = cart?.items ? [...cart.items] : [];

    const existingItem = items.find((item: any) => item.productId === productId);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) throw new Error(`Stock insuffisant. Disponible: ${product.stock}`);
      existingItem.quantity = newQuantity;
    } else {
      items.push({
        productId: productId,
        quantity,
        price: product.price,
        name: product.name,
        image: product.image
      });
    }

    return this.cartRepo.createOrUpdate(userId, items);
  }

  async updateQuantity(userId: string, itemId: string, quantity: number): Promise<Cart> {
    const cart = await this.cartRepo.findByUserId(userId);
    if (!cart) throw new Error('Panier non trouvé');

    const items = cart.items.map((item: any) => {
      if (item.productId === itemId) {
        return { ...item, quantity };
      }
      return item;
    });

    return this.cartRepo.createOrUpdate(userId, items);
  }

  async removeFromCart(userId: string, itemId: string): Promise<Cart> {
    const cart = await this.cartRepo.findByUserId(userId);
    if (!cart) throw new Error('Panier non trouvé');

    const items = cart.items.filter((item: any) => item.productId !== itemId);
    return this.cartRepo.createOrUpdate(userId, items);
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartRepo.deleteByUserId(userId);
  }
}