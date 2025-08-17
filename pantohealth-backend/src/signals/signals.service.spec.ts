import { Test, TestingModule } from '@nestjs/testing';
import { SignalsService } from './signals.service';
import { getModelToken } from '@nestjs/mongoose';
import { Signal } from './schemas/signal.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

const mockSignal = {
  deviceId: 'test-device-123',
  time: new Date(),
  dataLength: 10,
  dataVolume: 512,
};

const mockSignalDocument = {
  save: jest.fn().mockResolvedValue(mockSignal),
};

const mockConstructor = jest.fn().mockImplementation(() => mockSignalDocument);

const mockStaticMethods = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
};

const mockSignalModel = Object.assign(mockConstructor, mockStaticMethods);

mockSignalModel.find = jest.fn();
mockSignalModel.findById = jest.fn();
mockSignalModel.findByIdAndUpdate = jest.fn();
mockSignalModel.deleteOne = jest.fn();

describe('SignalsService', () => {
  let service: SignalsService;
  let model: Model<Signal>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignalsService,
        {
          provide: getModelToken(Signal.name),
          useValue: mockSignalModel,
        },
      ],
    }).compile();

    service = module.get<SignalsService>(SignalsService);
    model = module.get<Model<Signal>>(getModelToken(Signal.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new signal', async () => {
      // Act
      const result = await service.create(
        'test-device-123',
        Date.now(),
        new Array(10),
        Buffer.from('dummy buffer of size 21'),
      );

      expect(mockSignalModel).toHaveBeenCalledWith({
        deviceId: 'test-device-123',
        time: expect.any(Date),
        dataLength: 10,
        dataVolume: 23,
      });
      expect(mockSignalDocument.save).toHaveBeenCalled();
      expect(result).toEqual(mockSignal);
    });
  });

  describe('findOne', () => {
    it('should find and return a signal by ID', async () => {
      (model.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSignal),
      });

      const result = await service.findOne('some-id');

      expect(model.findById).toHaveBeenCalledWith('some-id');
      expect(result).toEqual(mockSignal);
    });

    it('should throw NotFoundException if signal is not found', async () => {
      (model.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null), // Simulate not finding a document
      });

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
