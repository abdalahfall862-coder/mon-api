import { DataSource } from 'typeorm';
import { OrderRepository } from '../repositories/OrderRepository';
import { CartRepository } from '../repositories/CartRepository';
import { ProductRepository } from '../repositories/ProductRepository';
import { Order, OrderStatus, PaymentStatus } from '../entities/Order';
import { DeliveryType } from '../entities/Delivery';
import { CreateOrderDto } from '../dto/CreateOrderDto';

// Tarifs livraison Sénégal (FCFA)
const DELIVERY_COSTS: Record<string, number> = {
  pickup: 0,
  yango: 2500,
  express: 3500,
  standard: 1500
};

export class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private cartRepo: CartRepository,
    private productRepo: ProductRepository,
    private dataSource: DataSource
  ) {}

  private calculateDeliveryCost(deliveryType: string, city: string): number {
    const cityLower = city.toLowerCase();
    
    if (deliveryType === 'yango' && cityLower !== 'dakar') {
      throw new Error('Yango n\'est disponible que à Dakar');
    }

    return DELIVERY_COSTS[deliveryType] || DELIVERY_COSTS.standard;
  }

  private getBestDeliveryOption(city: string): { type: string; cost: number } {
    const cityLower = city.toLowerCase();
    
    if (cityLower === 'dakar') {
      return { type: 'yango', cost: DELIVERY_COSTS.yango };
    }
    
    return { type: 'standard', cost: DELIVERY_COSTS.standard };
  }

  async createOrder(userId: string, dto: CreateOrderDto): Promise<Order> {
    // 1. Récupérer le panier
    const cart = await this.cartRepo.findByUserId(userId);
    if (!cart || cart.items.length === 0) throw new Error('Panier vide');

    // 2. Calculer livraison
    const deliveryType = dto.deliveryType || this.getBestDeliveryOption(dto.shippingAddress.city).type;
    const deliveryCost = this.calculateDeliveryCost(deliveryType, dto.shippingAddress.city);

    // 3. Vérifier stock et calculer total
    let productsTotal = 0;
    const orderItems: any[] = [];

    for (const cartItem of cart.items) {
      const product = await this.productRepo.findById(cartItem.productId);
      if (!product) throw new Error(`Produit ${cartItem.productId} non trouvé`);
      if (product.stock < cartItem.quantity) {
        throw new Error(`Stock insuffisant pour "${product.name}" (disponible: ${product.stock})`);
      }

      // Décrémenter stock
      await this.productRepo.decrementStock(product.id, cartItem.quantity);

      orderItems.push({
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        priceAtPurchase: product.price,
        name: product.name
      });

      productsTotal += Number(product.price) * cartItem.quantity;
    }

    const total = productsTotal + deliveryCost;

    // 4. Créer la commande
    const order = await this.orderRepo.create({
      userId,
      items: orderItems,
      total,
      shippingAddress: dto.shippingAddress,
      paymentMethod: dto.paymentMethod || 'card',
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      delivery: {
        type: deliveryType,
        cost: deliveryCost,
        address: dto.shippingAddress.street,
        city: dto.shippingAddress.city,
        status: 'preparing'
      }
    });

    // 5. Vider le panier
    await this.cartRepo.deleteByUserId(userId);

    return order;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.orderRepo.findByUserId(userId);
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepo.findAll();
  }

  async getOrderById(orderId: any, userId: string, isAdmin: boolean): Promise<Order> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new Error('Commande non trouvée');
    if (!isAdmin && order.userId !== userId) throw new Error('Accès non autorisé');
    return order;
  }

  async updateOrderStatus(orderId: any, status: OrderStatus): Promise<Order> {
    const order = await this.orderRepo.updateStatus(orderId, status);
    if (!order) throw new Error('Commande non trouvée');
    return order;
  }
}