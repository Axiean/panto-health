/**
 * app.module.ts
 *
 * The root module for the producer application.
 *
 * This module orchestrates the necessary components for the IoT device simulator:
 * - `ConfigModule`: Globally provides environment variable configuration.
 * - `RabbitMQModule`: Establishes and manages the connection to the RabbitMQ broker.
 * - `AppService`: Contains the core logic for reading data and publishing messages.
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [
    // Initialize the ConfigModule and make it global so the ConfigService
    // is available throughout the application.
    ConfigModule.forRoot({ isGlobal: true }),

    // Import the module responsible for connecting to RabbitMQ.
    RabbitMQModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
