import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SignalsModule } from './signals/signals.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/pantohealth'),
    RabbitMQModule,
    SignalsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
