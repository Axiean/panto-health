/**
 * main.ts
 *
 * This is the primary entry point for the NestJS application.
 * It is responsible for:
 * - Creating the Nest application instance.
 * - Applying global configurations such as validation pipes and API documentation.
 * - Loading environment variables via the ConfigService.
 * - Starting the HTTP server and listening for incoming requests on the configured port.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply a global validation pipe. This ensures all incoming request DTOs
  // are automatically validated against their defined class-validator rules.
  app.useGlobalPipes(new ValidationPipe());

  // The ConfigService is used to fetch environment variables in a type-safe way,
  // abstracting the configuration from the source code.
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  // Setup Swagger for interactive API documentation. The DocumentBuilder creates a base
  // document that conforms to the OpenAPI Specification.
  const config = new DocumentBuilder()
    .setTitle('PANTOhealth IoT API')
    .setDescription(
      'API for managing and retrieving X-ray signal data from IoT devices.',
    )
    .setVersion('1.0')
    .addTag('Signals', 'Endpoints for signal data operations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // The API documentation will be available at the '/api' endpoint.
  SwaggerModule.setup('api', app, document);

  await app.listen(port ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
