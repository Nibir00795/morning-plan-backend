import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Public } from '../common/decorators/public.decorator';
import { WebhooksService } from './webhooks.service';
import type { RevenueCatEvent } from './webhooks.service';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  private readonly secret: string;

  constructor(
    private readonly webhooksService: WebhooksService,
    config: ConfigService,
  ) {
    this.secret = config.get<string>('REVENUECAT_WEBHOOK_SECRET', '');
  }

  @Public()
  @Post('revenuecat')
  @ApiOperation({ summary: 'RevenueCat subscription webhook' })
  async handleRevenueCat(
    @Body() body: RevenueCatEvent,
    @Headers('authorization') authHeader?: string,
  ) {
    if (this.secret && authHeader !== `Bearer ${this.secret}`) {
      throw new UnauthorizedException('Invalid webhook secret');
    }

    await this.webhooksService.handleRevenueCat(body);
    return { ok: true };
  }
}
