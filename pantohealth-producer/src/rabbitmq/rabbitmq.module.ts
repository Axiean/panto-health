import { Module } from '@nestjs/common';
import { RabbitMQModule as RmqModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RmqModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        exchanges: [
          {
            name: 'pantohealth-exchange',
            type: 'topic',
          },
        ],
        uri: configService.get<string>('RABBITMQ_URI'),
        connectionInitOptions: { wait: false },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [RmqModule],
})
export class RabbitMQModule {}
