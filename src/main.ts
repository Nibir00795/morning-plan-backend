import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Morning Plan API')
    .setDescription(
      'Backend API for the Morning Plan / Routine mobile app. ' +
      'Manages famous-person routines, user tasks, completions, streaks, reminders, and subscriptions.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'supabase-jwt',
    )
    .addApiKey(
      { type: 'apiKey', name: 'x-admin-api-key', in: 'header' },
      'admin-api-key',
    )
    .addTag('Auth', 'User authentication & profile')
    .addTag('Users', 'User preferences & favorites')
    .addTag('Famous Persons', 'Celebrity routines (public)')
    .addTag('Tasks', 'User task CRUD & day assignments')
    .addTag('Completions', 'Mark tasks done / undo')
    .addTag('Streaks', 'Streak calculation')
    .addTag('Day Starts', 'Record daily app opens')
    .addTag('Reminders', 'Push-notification reminders')
    .addTag('Webhooks', 'RevenueCat subscription webhooks')
    .addTag('Events', 'User behaviour event logging')
    .addTag('Admin', 'Admin panel — manage famous persons, tasks & icons')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`Morning Plan API running on port ${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/docs`);
}
bootstrap();
