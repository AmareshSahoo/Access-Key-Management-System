import { KafkaService } from './../../kafka/services/kafka.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { KeyService } from './key.service';
import { Key } from '../schemas/key.schema';

const mockKey = {
  keyValue: 'testKey',
  rateLimit: 10,
  expirationTime: new Date(Date.now() + 1000 * 60 * 60),
  isDisabled: false,
};

const mockKeyModel = {
  new: jest.fn().mockResolvedValue(mockKey),
  constructor: jest.fn().mockResolvedValue(mockKey),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
};

describe('KeyService', () => {
  let service: KeyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeyService,
        {
          provide: getModelToken(Key.name),
          useValue: mockKeyModel,
        },
        {
          provide: KafkaService,
          useValue: {
            sendMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<KeyService>(KeyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a key', async () => {
    const createKeyDto = {
      keyValue: 'testKey',
      rateLimit: 10,
      expirationTime: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    };
    expect(await service.create(createKeyDto)).toEqual(mockKey);
  });

  it('should find a key', async () => {
    mockKeyModel.findOne.mockResolvedValue(mockKey);
    expect(await service.findOne('testKey')).toEqual(mockKey);
  });

  it('should update a key', async () => {
    const updateKeyDto = {
      rateLimit: 20,
    };
    mockKeyModel.findOneAndUpdate.mockResolvedValue({
      ...mockKey,
      rateLimit: 20,
    });
    expect(await service.update('testKey', updateKeyDto)).toEqual({
      ...mockKey,
      rateLimit: 20,
    });
  });

  it('should remove a key', async () => {
    mockKeyModel.deleteOne.mockResolvedValue({ deletedCount: 1 });
    await expect(service.remove('testKey')).resolves.not.toThrow();
  });
});
