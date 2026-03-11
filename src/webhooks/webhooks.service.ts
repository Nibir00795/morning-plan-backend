import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, SubscriptionTier, SubscriptionEvent } from '../entities';

export interface RevenueCatEvent {
  event: {
    type: string;
    app_user_id: string;
    product_id?: string;
    entitlement_ids?: string[];
    expiration_at_ms?: number;
  };
}

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(SubscriptionEvent) private subEventRepo: Repository<SubscriptionEvent>,
  ) {}

  async handleRevenueCat(body: RevenueCatEvent): Promise<void> {
    const { event } = body;
    this.logger.log(`RevenueCat event: ${event.type} for user ${event.app_user_id}`);

    const user = await this.userRepo.findOne({
      where: { id: event.app_user_id },
    });

    if (!user) {
      this.logger.warn(`User not found for RevenueCat event: ${event.app_user_id}`);
      return;
    }

    await this.subEventRepo.save(
      this.subEventRepo.create({
        userId: user.id,
        eventType: event.type,
        payload: event as any,
      }),
    );

    const upgradeEvents = [
      'INITIAL_PURCHASE',
      'RENEWAL',
      'PRODUCT_CHANGE',
      'UNCANCELLATION',
    ];

    const downgradeEvents = [
      'EXPIRATION',
      'CANCELLATION',
      'BILLING_ISSUE',
    ];

    if (upgradeEvents.includes(event.type)) {
      user.subscriptionTier = SubscriptionTier.PREMIUM;
      await this.userRepo.save(user);
      this.logger.log(`User ${user.id} upgraded to PREMIUM`);
    } else if (downgradeEvents.includes(event.type)) {
      user.subscriptionTier = SubscriptionTier.FREE;
      await this.userRepo.save(user);
      this.logger.log(`User ${user.id} downgraded to FREE`);
    }
  }
}
