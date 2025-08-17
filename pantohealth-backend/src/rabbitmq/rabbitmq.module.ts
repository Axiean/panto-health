import { Module } from '@nestjs/common';
import { RabbitMQModule as RmqModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitmqService } from './rabbitmq.service';
import { SignalsModule } from 'src/signals/signals.module';

@Module({
  imports: [
    SignalsModule,
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
  providers: [RabbitmqService],
  exports: [RmqModule],
})
export class RabbitMQModule {}
