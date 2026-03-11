import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminApiKeyGuard implements CanActivate {
  private readonly apiKey: string;

  constructor(config: ConfigService) {
    this.apiKey = config.get<string>('ADMIN_API_KEY', '');
  }

  canActivate(context: ExecutionContext): boolean {
    if (!this.apiKey) {
      throw new UnauthorizedException('Admin API key not configured');
    }

    const request = context.switchToHttp().getRequest();
    const header = request.headers['x-admin-api-key'];

    if (header !== this.apiKey) {
      throw new UnauthorizedException('Invalid admin API key');
    }

    return true;
  }
}
