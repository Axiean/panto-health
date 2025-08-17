/**
 * rabbitmq.service.ts
 *
 * This service is responsible for consuming messages from the RabbitMQ broker.
 * It contains the primary business logic for handling incoming IoT data,
 * including validation, transformation, and delegation to other services for persistence.
 */

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

  /**
   * Consumes, validates, and processes messages from the 'x-ray.data' routing key.
   * This method acts as the entry point for all incoming IoT signals from the message queue.
   *
   * @param msg The raw message payload from RabbitMQ.
   * @param amqpMsg The full AMQP message object, including metadata.
   * @returns A Promise that resolves to void on success, or a Nack object on validation failure.
   */
  @RabbitSubscribe({
    exchange: 'pantohealth-exchange',
    routingKey: 'xray.data',
    queue: 'x-ray-queue',
  })
  public async handleXrayData(msg: DeviceDataDto, amqpMsg: ConsumeMessage) {
    const deviceIds = Object.keys(msg);

    // First, perform a basic structural check on the message.
    if (deviceIds.length !== 1) {
      this.logger.error({
        message: 'Invalid message format: expected a single device key.',
        msg,
      });
      // If the message structure is invalid, reject it using Nack(false).
      // This tells RabbitMQ to discard the message without requeueing, preventing infinite processing loops.
      return new Nack(false);
    }

    const deviceId = deviceIds[0];
    const deviceData = msg[deviceId];

    // Next, validate the nested device data payload against our DTO.
    const payloadToValidate = plainToInstance(DeviceDataDto, deviceData);
    const errors = await validate(payloadToValidate);

    if (errors.length > 0) {
      this.logger.error({
        message: 'Invalid message payload. Rejecting message.',
        deviceId: deviceId,
        errors: errors,
      });
      return new Nack(false); // Reject and discard on validation failure.
    }

    // If validation passes, delegate to the SignalsService to handle the business logic.
    this.logger.log({ message: `Validated message for device`, deviceId });
    const { data, time } = deviceData;
    await this.signalsService.create(deviceId, time, data, amqpMsg.content);
  }
}
