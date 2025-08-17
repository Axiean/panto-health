import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ConsumeMessage } from 'amqplib';
import { SignalsService } from 'src/signals/signals.service';

interface XRayDataPayload {
  [deviceId: string]: {
    data: any[];
    time: number;
  };
}

@Injectable()
export class RabbitmqService {
  constructor(private readonly signalsService: SignalsService) {}

  @RabbitSubscribe({
    exchange: 'pantohealth-exchange',
    routingKey: 'xray.data',
    queue: 'x-ray-queue',
  })
  public async handleXrayData(msg: XRayDataPayload, amqpMsg: ConsumeMessage) {
    // Extract deviceId and timestamp from the message [cite: 61]
    const deviceId = Object.keys(msg)[0];
    const { data, time } = msg[deviceId];

    // Pass the data to the service to be processed and stored
    await this.signalsService.create(deviceId, time, data, amqpMsg.content);
  }
}
