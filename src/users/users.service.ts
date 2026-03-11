import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User, UserFavorite, SubscriptionTier } from '../entities';
import { SaveFavoritesDto } from './dto/save-favorites.dto';

@Injectable()
export class UsersService {
  private freeFavLimit: number;
  private premiumFavLimit: number;

  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(UserFavorite) private favRepo: Repository<UserFavorite>,
    config: ConfigService,
  ) {
    this.freeFavLimit = config.get<number>('FREE_FAVORITE_LIMIT', 2);
    this.premiumFavLimit = config.get<number>('PREMIUM_FAVORITE_LIMIT', 5);
  }

  async saveFavorites(userId: string, dto: SaveFavoritesDto): Promise<UserFavorite[]> {
    const user = await this.usersRepo.findOneOrFail({ where: { id: userId } });
    const limit = user.subscriptionTier === SubscriptionTier.PREMIUM
      ? this.premiumFavLimit
      : this.freeFavLimit;

    if (dto.famousPersonIds.length > limit) {
      throw new BadRequestException(
        `You can pick at most ${limit} favorites. ${user.subscriptionTier === SubscriptionTier.FREE ? 'Upgrade to premium for more.' : ''}`,
      );
    }

    await this.favRepo.delete({ userId });

    const favorites = dto.famousPersonIds.map((fpId) =>
      this.favRepo.create({ userId, famousPersonId: fpId }),
    );
    return this.favRepo.save(favorites);
  }

  async getFavorites(userId: string): Promise<UserFavorite[]> {
    return this.favRepo.find({
      where: { userId },
      relations: ['famousPerson'],
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }
}
