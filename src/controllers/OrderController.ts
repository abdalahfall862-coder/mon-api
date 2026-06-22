import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import { CreateOrderDto } from '../dto/CreateOrderDto';
import { UpdateOrderStatusDto } from '../dto/UpdateOrderStatusDto';
import { OrderStatus } from '../entities/Order';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer'; // ✅ import ajouté

export class OrderController {
  constructor(private orderService: OrderService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = plainToInstance(CreateOrderDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        res.status(400).json({ errors: errors.map(e => e.constraints) });
        return;
      }

      const userId = (req as any).user.id.toString();
      const order = await this.orderService.createOrder(userId, dto);
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getMyOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id.toString();
      const orders = await this.orderService.getUserOrders(userId);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const orders = await this.orderService.getAllOrders();
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id.toString();
      const isAdmin = (req as any).user.role === 'admin';
      const order = await this.orderService.getOrderById(req.params.id, userId, isAdmin);
      res.json(order);
    } catch (error: any) {
      res.status(403).json({ error: error.message });
    }
  };

  updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = plainToInstance(UpdateOrderStatusDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        res.status(400).json({ errors: errors.map(e => e.constraints) });
        return;
      }

      const order = await this.orderService.updateOrderStatus(req.params.id, dto.status);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}