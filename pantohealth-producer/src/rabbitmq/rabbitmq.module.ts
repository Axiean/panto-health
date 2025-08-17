import { Module } from '@nestjs/common';
import { RabbitMQModule as RmqModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    RmqModule.forRoot({
      exchanges: [
        {
          name: 'pantohealth-exchange',
          type: 'topic',
        },
      ],
      uri: 'amqp://guest:guest@localhost:5672',
      connectionInitOptions: { wait: false },
    }),
  ],
  exports: [RmqModule],
})
export class RabbitMQModule {}
