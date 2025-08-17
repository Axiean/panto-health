/**
 * app.module.ts
 *
 * The root module of the application. It serves as the central point for assembling
 * all other modules and configuring application-wide providers and services.
 * This module is responsible for:
 * - Globally initializing the configuration module (`ConfigModule`).
 * - Establishing a connection to the MongoDB database using `MongooseModule`.
 * - Importing feature-specific modules (`RabbitMQModule`, `SignalsModule`).
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { SignalsModule } from './signals/signals.module';

@Module({
  imports: [
    // Initialize the ConfigModule and make it global. This allows any module in the
    // application to inject and use the ConfigService without needing to import ConfigModule again.
    ConfigModule.forRoot({ isGlobal: true }),

    // Configure the database connection asynchronously. This pattern is used to ensure
    // that the ConfigService is available to fetch the database URI from environment variables
    // before attempting to connect.
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),

    // Import the application's feature modules.
    RabbitMQModule,
    SignalsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
