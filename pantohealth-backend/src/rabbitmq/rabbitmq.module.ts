import { Module } from '@nestjs/common';
import { RabbitMQModule as RmqModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitmqService } from './rabbitmq.service';
import { SignalsModule } from 'src/signals/signals.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SignalsModule,
    RmqModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        exchanges: [{ name: 'pantohealth-exchange', type: 'topic' }],
        uri: configService.get<string>('RABBITMQ_URI'),
        connectionInitOptions: { wait: false },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RabbitmqService],
  exports: [RmqModule],
})
export class RabbitMQModule {}
