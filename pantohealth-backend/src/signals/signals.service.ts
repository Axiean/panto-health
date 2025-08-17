import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Signal, SignalDocument } from './schemas/signal.schema';
import { UpdateSignalDto } from './dto';

@Injectable()
export class SignalsService {
  private readonly logger = new Logger(SignalsService.name);

  constructor(
    @InjectModel(Signal.name) private signalModel: Model<SignalDocument>,
  ) {}

  async create(
    deviceId: string,
    timestamp: number,
    data: any[],
    originalMessage: Buffer,
  ): Promise<Signal> {
    const dataLength = data.length; // Calculate data length [cite: 62]
    const dataVolume = originalMessage.length; // Calculate the size in bytes [cite: 54]

    const newSignal = new this.signalModel({
      deviceId,
      time: new Date(timestamp),
      dataLength,
      dataVolume,
    });

    this.logger.log(`Saving signal for device: ${deviceId}`);
    return newSignal.save(); // Save the document to the collection [cite: 64]
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
