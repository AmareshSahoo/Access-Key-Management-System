import { Test, TestingModule } from '@nestjs/testing';
import { KeyController } from './key.controller';
import { KeyService } from '../services/key.service';

const mockKeyService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  disableKey: jest.fn(),
};

describe('KeyController', () => {
  let controller: KeyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeyController],
      providers: [
        {
          provide: KeyService,
          useValue: mockKeyService,
        },
      ],
    }).compile();

    controller = module.get<KeyController>(KeyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a key', async () => {
    const createKeyDto = {
      keyValue: 'testKey',
      rateLimit: 10,
      expirationTime: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    };
    mockKeyService.create.mockResolvedValue(createKeyDto);
    expect(await controller.create(createKeyDto)).toEqual(createKeyDto);
  });

  it('should find all keys', async () => {
    mockKeyService.findAll.mockResolvedValue(['testKey']);
    expect(await controller.findAll()).toEqual(['testKey']);
  });

  it('should find one key', async () => {
    mockKeyService.findOne.mockResolvedValue('testKey');
    expect(await controller.findOne('testKey')).toEqual('testKey');
  });

  it('should update a key', async () => {
    const updateKeyDto = {
      rateLimit: 20,
    };
    mockKeyService.update.mockResolvedValue(updateKeyDto);
    expect(await controller.update('testKey', updateKeyDto)).toEqual(updateKeyDto);
  });

  it('should remove a key', async () => {
    mockKeyService.remove.mockResolvedValue(undefined);
    await expect(controller.remove('testKey')).resolves.not.toThrow();
  });
});
