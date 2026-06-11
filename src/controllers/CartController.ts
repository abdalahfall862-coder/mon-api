import { Request, Response } from 'express';
import { CartService } from '../services/CartService';
import { AddToCartDto } from '../dto/AddToCartDto';
import { UpdateCartItemDto } from '../dto/UpdateCartItemDto';
import { validate } from 'class-validator';

export class CartController {
  constructor(private cartService: CartService) {}

  getCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id.toString();
      const cart = await this.cartService.getCart(userId);
      res.json(cart || { items: [] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  addToCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = Object.assign(new AddToCartDto(), req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        res.status(400).json({ errors: errors.map(e => e.constraints) });
        return;
      }

      const userId = (req as any).user.id.toString();
      const cart = await this.cartService.addToCart(userId, dto.productId.toString(), dto.quantity);
      res.json(cart);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  updateQuantity = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = Object.assign(new UpdateCartItemDto(), req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        res.status(400).json({ errors: errors.map(e => e.constraints) });
        return;
      }

      const userId = (req as any).user.id.toString();
      const itemId = typeof req.params.itemId === 'string' ? req.params.itemId : req.params.itemId[0];  // ← CORRIGÉ
      const cart = await this.cartService.updateQuantity(userId, itemId, dto.quantity);
      res.json(cart);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  removeFromCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id.toString();
      const itemId = typeof req.params.itemId === 'string' ? req.params.itemId : req.params.itemId[0];  // ← CORRIGÉ
      const cart = await this.cartService.removeFromCart(userId, itemId);
      res.json(cart);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  clearCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id.toString();
      await this.cartService.clearCart(userId);
      res.json({ message: 'Panier vidé' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}