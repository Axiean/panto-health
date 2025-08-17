import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

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
    const dataPath = path.join(__dirname, '..', 'x-ray.json');
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    this.sampleData = JSON.parse(fileContents);
    this.deviceIds = Object.keys(this.sampleData);
    this.logger.log(`Loaded data for ${this.deviceIds.length} devices.`);
  }

  onModuleInit() {
    // Send data every 10 seconds to simulate an IoT device
    setInterval(() => this.sendXrayData(), 10000);
  }

  sendXrayData() {
    const randomDeviceId =
      this.deviceIds[Math.floor(Math.random() * this.deviceIds.length)];
    const deviceData = this.sampleData[randomDeviceId];

    if (!deviceData) {
      this.logger.error(`No data found for device: ${randomDeviceId}`);
      return;
    }

    const payload = {
      [randomDeviceId]: {
        data: deviceData.data,
        time: Date.now(),
      },
    };

    this.amqpConnection.publish('pantohealth-exchange', 'xray.data', payload);

    this.logger.log(`Sent data for random device: ${randomDeviceId}`);
  }
}
