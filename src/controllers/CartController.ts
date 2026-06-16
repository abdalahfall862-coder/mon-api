import { Request, Response } from 'express';
import { CartService } from '../services/CartService';
import { plainToInstance } from 'class-transformer';
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
      console.log('Body reçu:', JSON.stringify(req.body));
      const dto = plainToInstance(AddToCartDto, req.body);
      console.log('DTO:', JSON.stringify(dto));
      const errors = await validate(dto);
      console.log('Erreurs validation:', JSON.stringify(errors.map(e => e.constraints)));
      if (errors.length > 0) {
        res.status(400).json({ errors: errors.map(e => e.constraints), message: errors.map(e => Object.values(e.constraints || {}).join(', ')).join('; ') });
        return;
      }
      const userId = (req as any).user.id.toString();
      const cart = await this.cartService.addToCart(userId, dto.productId.toString(), Number(dto.quantity));
      res.json(cart);
    } catch (error: any) {
      console.error('Erreur addToCart:', error);
      res.status(400).json({ error: error.message });
    }
  };

  updateQuantity = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = plainToInstance(UpdateCartItemDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        res.status(400).json({ errors: errors.map(e => e.constraints) });
        return;
      }
      const userId = (req as any).user.id.toString();
      const itemId = req.params.itemId;
      const cart = await this.cartService.updateQuantity(userId, itemId, Number(dto.quantity));
      res.json(cart);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  removeFromCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id.toString();
      const itemId = req.params.itemId;
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