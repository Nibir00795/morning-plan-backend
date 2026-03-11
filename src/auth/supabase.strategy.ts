import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, AuthProvider } from '../entities';

interface SupabaseJwtPayload {
  sub: string;
  email?: string;
  app_metadata?: { provider?: string };
  user_metadata?: { full_name?: string; avatar_url?: string };
  aud: string;
  exp: number;
}

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {
    const secret = config.get<string>('SUPABASE_JWT_SECRET') || 'fallback-dev-secret';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: SupabaseJwtPayload): Promise<User> {
    const supabaseUid = payload.sub;
    if (!supabaseUid) throw new UnauthorizedException();

    let user = await this.usersRepo.findOne({ where: { supabaseUid } });

    if (!user) {
      const provider = payload.app_metadata?.provider;
      let authProvider = AuthProvider.ANONYMOUS;
      if (provider === 'google') authProvider = AuthProvider.GOOGLE;
      else if (provider === 'apple') authProvider = AuthProvider.APPLE;

      user = this.usersRepo.create({
        supabaseUid,
        email: payload.email,
        displayName: payload.user_metadata?.full_name,
        avatarUrl: payload.user_metadata?.avatar_url,
        authProvider,
        isGuest: authProvider === AuthProvider.ANONYMOUS,
      });
      user = await this.usersRepo.save(user);
    }

    return user;
  }
}
