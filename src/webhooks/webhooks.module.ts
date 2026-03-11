import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, SubscriptionEvent } from '../entities';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, SubscriptionEvent])],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
