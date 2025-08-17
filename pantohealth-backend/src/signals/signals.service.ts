/**
 * signals.service.ts
 *
 * This service encapsulates all business logic related to the 'Signal' entity.
 * It acts as an abstraction layer between the controller/consumer and the database model.
 * Responsibilities include creating new signals, querying for existing ones, and performing updates/deletions.
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Signal, SignalDocument } from './schemas/signal.schema';
import { UpdateSignalDto } from './dto';

@Injectable()
export class SignalsService {
  private readonly logger = new Logger(SignalsService.name);

  // The Mongoose Model is injected via the constructor, allowing this service
  // to interact with the 'signals' collection in the database.
  constructor(
    @InjectModel(Signal.name) private signalModel: Model<SignalDocument>,
  ) {}

  /**
   * Processes and persists a new signal to the database.
   * This method calculates metadata from the raw message before saving.
   *
   * @param deviceId The ID of the device that sent the signal.
   * @param timestamp The timestamp of the signal.
   * @param data The raw data array from the signal.
   * @param originalMessage The raw message buffer, used to calculate data volume.
   * @returns The newly created and saved Signal document.
   */
  async create(
    deviceId: string,
    timestamp: number,
    data: any[],
    originalMessage: Buffer,
  ): Promise<Signal> {
    const dataLength = data.length;
    const dataVolume = originalMessage.length; // The size of the original data in bytes.;

    const newSignal = new this.signalModel({
      deviceId,
      time: new Date(timestamp),
      dataLength,
      dataVolume,
    });

    this.logger.log(`Saving signal for device: ${deviceId}`);
    return newSignal.save();
  }

  async findAll(filter: FilterQuery<SignalDocument>): Promise<Signal[]> {
    return this.signalModel.find(filter).exec();
  }

  async findOne(id: string): Promise<Signal> {
    const signal = await this.signalModel.findById(id).exec();
    if (!signal) {
      throw new NotFoundException(`Signal with ID "${id}" not found`);
    }
    return signal;
  }

  async update(id: string, updateSignalDto: UpdateSignalDto): Promise<Signal> {
    const existingSignal = await this.signalModel
      .findByIdAndUpdate(id, updateSignalDto, { new: true })
      .exec();
    if (!existingSignal) {
      throw new NotFoundException(`Signal with ID "${id}" not found`);
    }
    return existingSignal;
  }

  async remove(id: string): Promise<any> {
    const result = await this.signalModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Signal with ID "${id}" not found`);
    }
    return { acknowledged: true, deletedCount: result.deletedCount };
  }
}
