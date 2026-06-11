import { Repository, DataSource } from 'typeorm';
import { Favorite } from '../entities/Favorite';

export class FavoriteRepository {
  private repo: Repository<Favorite>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Favorite);
  }

  async findByUserId(userId: string): Promise<Favorite[]> {
    return this.repo.find({ where: { userId } });
  }

  async findOne(userId: string, productId: string): Promise<Favorite | null> {
    return this.repo.findOne({ where: { userId, productId } });
  }

  async create(userId: string, productId: string): Promise<Favorite> {
    const favorite = this.repo.create({ userId, productId });
    return this.repo.save(favorite);
  }

  async delete(id: any): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected !== 0;
  }
}