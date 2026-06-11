import { FavoriteRepository } from '../repositories/FavoriteRepository';
import { Favorite } from '../entities/Favorite';

export class FavoriteService {
  constructor(private favoriteRepo: FavoriteRepository) {}

  async getFavorites(userId: string): Promise<Favorite[]> {
    return this.favoriteRepo.findByUserId(userId);
  }

  async addFavorite(userId: string, productId: string): Promise<Favorite> {
    const existing = await this.favoriteRepo.findOne(userId, productId);
    if (existing) throw new Error('Produit déjà dans les favoris');
    return this.favoriteRepo.create(userId, productId);
  }

  async removeFavorite(userId: string, favoriteId: string): Promise<void> {
    const favorites = await this.favoriteRepo.findByUserId(userId);
    const favorite = favorites.find((f: any) => f.id.toString() === favoriteId);
    if (!favorite) throw new Error('Favori non trouvé');
    await this.favoriteRepo.delete(favorite.id);
  }
}