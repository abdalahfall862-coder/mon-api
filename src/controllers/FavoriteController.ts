import { Request, Response } from 'express';
import { FavoriteService } from '../services/FavoriteService';

export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}

  getFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id.toString();
      const favorites = await this.favoriteService.getFavorites(userId);
      res.json(favorites);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  addFavorite = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id.toString();
      const productId = req.body.productId.toString();
      const favorite = await this.favoriteService.addFavorite(userId, productId);
      res.status(201).json(favorite);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  removeFavorite = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id.toString();
      const favoriteId = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];  // ← CORRIGÉ
      await this.favoriteService.removeFavorite(userId, favoriteId);
      res.json({ message: 'Retiré des favoris' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}