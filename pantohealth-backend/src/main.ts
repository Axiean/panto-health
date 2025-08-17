import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // --- Swagger Configuration ---
  const config = new DocumentBuilder()
    .setTitle('PANTOhealth IoT API')
    .setDescription(
      'API for managing and retrieving X-ray signal data from IoT devices.',
    )
    .setVersion('1.0')
    .addTag('Signals', 'Endpoints for signal data operations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // -----------------------------

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
