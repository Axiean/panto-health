import { Injectable, Logger } from '@nestjs/common';
import {
  AmqpConnection,
  Nack,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { ConsumeMessage } from 'amqplib';
import { SignalsService } from 'src/signals/signals.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { DeviceDataDto } from 'src/signals/dto';

@Injectable()
export class RabbitmqService {
  private readonly logger = new Logger(RabbitmqService.name);

  constructor(private readonly signalsService: SignalsService) {}

  @RabbitSubscribe({
    exchange: 'pantohealth-exchange',
    routingKey: 'xray.data',
    queue: 'x-ray-queue',
  })
  public async handleXrayData(msg: DeviceDataDto, amqpMsg: ConsumeMessage) {
    const deviceIds = Object.keys(msg);

    if (deviceIds.length !== 1) {
      this.logger.error({
        message: 'Invalid message format: expected a single device key.',
        msg,
      });
      return new Nack(false);
    }

    const deviceId = deviceIds[0];
    const deviceData = msg[deviceId];

    const payloadToValidate = plainToInstance(DeviceDataDto, deviceData);
    const errors = await validate(payloadToValidate);

    if (errors.length > 0) {
      this.logger.error({
        message: 'Invalid message payload. Rejecting message.',
        deviceId: deviceId,
        errors: errors,
      });
      return new Nack(false);
    }

    this.logger.log({ message: `Validated message for device`, deviceId });
    const { data, time } = deviceData;
    await this.signalsService.create(deviceId, time, data, amqpMsg.content);
  }
}
