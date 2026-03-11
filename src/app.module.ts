import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FamousPersonsModule } from './famous-persons/famous-persons.module';
import { TasksModule } from './tasks/tasks.module';
import { CompletionsModule } from './completions/completions.module';
import { StreaksModule } from './streaks/streaks.module';
import { DayStartsModule } from './day-starts/day-starts.module';
import { RemindersModule } from './reminders/reminders.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { EventsModule } from './events/events.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('POSTGRES_HOST', 'localhost'),
        port: config.get<number>('POSTGRES_PORT', 5432),
        username: config.get('POSTGRES_USER', 'morning_plan'),
        password: config.get('POSTGRES_PASSWORD', 'morning_plan_secret'),
        database: config.get('POSTGRES_DB', 'morning_plan'),
        autoLoadEntities: true,
        synchronize: config.get('NODE_ENV') !== 'production',
      }),
    }),

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
        },
      }),
    }),

    AuthModule,
    UsersModule,
    FamousPersonsModule,
    TasksModule,
    CompletionsModule,
    StreaksModule,
    DayStartsModule,
    RemindersModule,
    WebhooksModule,
    EventsModule,
    AdminModule,
  ],
})
export class AppModule {}
