import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ConsumeMessage } from 'amqplib';
import { SignalsService } from 'src/signals/signals.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { XRayPayloadDto } from 'src/signals/dto';

@Injectable()
export class RabbitmqService {
  private readonly logger = new Logger(RabbitmqService.name);

  constructor(
    private readonly signalsService: SignalsService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  @RabbitSubscribe({
    exchange: 'pantohealth-exchange',
    routingKey: 'xray.data',
    queue: 'x-ray-queue',
  })
  public async handleXrayData(msg: XRayPayloadDto, amqpMsg: ConsumeMessage) {
    const payload = plainToInstance(XRayPayloadDto, msg);
    const errors = await validate(payload);

    if (errors.length > 0) {
      this.logger.error({
        message: 'Invalid message structure received. Rejecting message.',
        errors: errors,
        originalMessage: msg,
      });
      this.amqpConnection.channel.nack(amqpMsg, false, false);
      return;
    }

    const deviceId = Object.keys(msg)[0];
    const { data, time } = msg[deviceId];

    this.logger.log({
      message: `Successfully validated and processing message for device`,
      deviceId: deviceId,
    });

    await this.signalsService.create(deviceId, time, data, amqpMsg.content);
  }
}
