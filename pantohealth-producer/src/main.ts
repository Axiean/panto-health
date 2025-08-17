/**
 * main.ts
 *
 * The entry point for the pantohealth-producer application.
 *
 * Unlike a typical web service, this application does not need to listen for incoming HTTP requests.
 * Its sole purpose is to start up, connect to RabbitMQ, and begin producing messages.
 *
 * Therefore, we use `NestFactory.createApplicationContext` instead of `NestFactory.create`.
 * This initializes the NestJS dependency injection container and allows the application
 * to run its logic (like the AppService's onModuleInit hook) without starting a web server,
 * making it more lightweight and efficient for its task.
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
