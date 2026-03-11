import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { User } from '../entities';
import { SupabaseStrategy } from './supabase.strategy';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [
    SupabaseStrategy,
    AuthService,
    { provide: APP_GUARD, useClass: SupabaseAuthGuard },
  ],
  exports: [SupabaseStrategy],
})
export class AuthModule {}
