import { Request, Response } from 'express';
import { AdminService } from '../services/AdminService';

export class AdminController {
  constructor(private adminService: AdminService) {}

  getStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.adminService.getStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}