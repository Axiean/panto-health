/**
 * app.service.ts
 *
 * This service is the core of the IoT device simulator.
 * Its responsibilities are:
 * - Loading the sample x-ray data from a JSON file into memory on startup.
 * - Periodically, on a set interval, simulating a data transmission event.
 * - In each event, randomly selecting a device from the loaded data.
 * - Constructing a message payload with the device's data and a current timestamp.
 * - Publishing the message to the appropriate RabbitMQ exchange and routing key.
 */

import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

// Define a type for our sample data for better code completion and type safety.
type SampleData = {
  [deviceId: string]: {
    data: any[];
    time: number;
  };
};

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);
  private sampleData: SampleData;
  private deviceIds: string[];

  constructor(private readonly amqpConnection: AmqpConnection) {
    // On instantiation, we synchronously read and parse the entire sample data file.
    // This makes it available in memory for the producer to randomly select from,
    // simulating a stream of data from multiple distinct devices.
    const dataPath = path.join(__dirname, '..', 'x-ray.json');
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    this.sampleData = JSON.parse(fileContents);
    this.deviceIds = Object.keys(this.sampleData);
    this.logger.log(`Loaded data for ${this.deviceIds.length} devices.`);
  }

  /**
   * This NestJS lifecycle hook is called once the module has been initialized.
   * We use it to start the message publishing interval.
   */
  onModuleInit() {
    // Send data every 5 seconds to simulate an IoT device's reporting frequency.
    setInterval(() => this.sendXrayData(), 5000);
  }

  /**
   * Simulates sending a single x-ray data message.
   */
  sendXrayData() {
    // Pick a random device ID from the loaded data to simulate variety.
    const randomDeviceId =
      this.deviceIds[Math.floor(Math.random() * this.deviceIds.length)];
    const deviceData = this.sampleData[randomDeviceId];

    if (!deviceData) {
      this.logger.error(`No data found for device: ${randomDeviceId}`);
      return;
    }

    // Construct the payload. We use the data from the file but override the timestamp
    // with the current time to simulate a live data stream.
    const payload = {
      [randomDeviceId]: {
        data: deviceData.data,
        time: Date.now(),
      },
    };

    // Publish the message to the exchange. The backend consumer is bound to this
    // exchange and routing key.
    this.amqpConnection.publish('pantohealth-exchange', 'xray.data', payload);

    this.logger.log(`Sent data for random device: ${randomDeviceId}`);
  }
}
