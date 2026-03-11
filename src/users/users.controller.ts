import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities';
import { UsersService } from './users.service';
import { SaveFavoritesDto } from './dto/save-favorites.dto';

@ApiTags('Users')
@ApiBearerAuth('supabase-jwt')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('favorites')
  @ApiOperation({ summary: 'Save favorite famous persons (free=2, premium=5)' })
  saveFavorites(@CurrentUser() user: User, @Body() dto: SaveFavoritesDto) {
    return this.usersService.saveFavorites(user.id, dto);
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Get current user favorites' })
  getFavorites(@CurrentUser() user: User) {
    return this.usersService.getFavorites(user.id);
  }
}
