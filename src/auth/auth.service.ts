import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, AuthProvider } from '../entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  async getProfile(userId: string): Promise<User> {
    return this.usersRepo.findOneOrFail({ where: { id: userId } });
  }

  async migrateGuest(
    guestUserId: string,
    supabaseUid: string,
    provider: AuthProvider,
    email?: string,
    displayName?: string,
    avatarUrl?: string,
  ): Promise<User> {
    const user = await this.usersRepo.findOneOrFail({ where: { id: guestUserId } });
    user.supabaseUid = supabaseUid;
    user.authProvider = provider;
    user.isGuest = false;
    if (email) user.email = email;
    if (displayName) user.displayName = displayName;
    if (avatarUrl) user.avatarUrl = avatarUrl;
    return this.usersRepo.save(user);
  }
}
