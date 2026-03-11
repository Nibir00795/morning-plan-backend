import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities';

@ApiTags('Auth')
@ApiBearerAuth('supabase-jwt')
@Controller('auth')
export class AuthController {
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@CurrentUser() user: User) {
    const { tasks, favorites, dayStarts, reminders, events, completions, ...profile } = user as any;
    return profile;
  }
}
