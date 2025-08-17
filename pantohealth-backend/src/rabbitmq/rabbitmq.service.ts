import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ConsumeMessage } from 'amqplib';
import { SignalsService } from 'src/signals/signals.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { XRayPayloadDto } from 'src/signals/dto';

@Injectable()
export class RabbitmqService {
  constructor(private readonly signalsService: SignalsService) {}

  @RabbitSubscribe({
    exchange: 'pantohealth-exchange',
    routingKey: 'xray.data',
    queue: 'x-ray-queue',
  })
  public async handleXrayData(msg: XRayPayloadDto, amqpMsg: ConsumeMessage) {
    const payload = plainToInstance(XRayPayloadDto, msg);
    const errors = await validate(payload);

    const deviceId = Object.keys(msg)[0];
    const { data, time } = msg[deviceId];

    await this.signalsService.create(deviceId, time, data, amqpMsg.content);
  }
}
