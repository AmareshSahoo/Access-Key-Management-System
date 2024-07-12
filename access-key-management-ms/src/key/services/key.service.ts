import { kafkaEvents } from './../../enums/event.enum';
import { KafkaService } from './../../kafka/services/kafka.service';
import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Key, KeyDocument } from '.././schemas/key.schema';
import { CreateKeyDto } from '.././dto/create-key.dto';
import { UpdateKeyDto } from '.././dto/update-key.dto';

@Injectable()
export class KeyService {
  constructor(
    @InjectModel(Key.name) private keyModel: Model<KeyDocument>,
    private kafkaService: KafkaService,
  ) {}

  async create(createKeyDto: CreateKeyDto): Promise<Key> {
    // Check if a key with the same keyValue already exists
    const existingKey = await this.keyModel.findOne({ keyValue: createKeyDto.keyValue }).exec();

    if (existingKey) {
      return this.update(createKeyDto.keyValue, createKeyDto)
    }
    
    const createdKey = new this.keyModel(createKeyDto);
    await createdKey.save();
    await this.kafkaService.sendMessage(kafkaEvents.KEY_CREATED, createdKey);
    return createdKey;
  }

  async findAll(): Promise<Key[]> {
    return this.keyModel.find().exec();
  }

  async findOne(keyValue: string): Promise<Key> {
    const key = await this.keyModel.findOne({ keyValue }).exec();
    if (!key) {
      throw new NotFoundException(`Key with value ${keyValue} not found`);
    }
    return key;
  }

  async update(keyValue: string, updateKeyDto: UpdateKeyDto): Promise<Key> {
    const updatedKey = await this.keyModel.findOneAndUpdate(
      { keyValue },
      updateKeyDto,
      { new: true },
    ).exec();
    if (!updatedKey) {
      throw new NotFoundException(`Key with value ${keyValue} not found`);
    }
    await this.kafkaService.sendMessage(kafkaEvents.KEY_UPDATED, updatedKey);
    return updatedKey;
  }

  async remove(keyValue: string): Promise<void> {
    const result = await this.keyModel.deleteOne({ keyValue }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Key with value ${keyValue} not found`);
    }
    await this.kafkaService.sendMessage(kafkaEvents.KEY_DELETED, { keyValue });
  }

  async disableKey(keyValue: string): Promise<Key> {
    const updatedKey = await this.keyModel.findOneAndUpdate(
      { keyValue },
      { isDisabled: true },
      { new: true },
    ).exec();
    if (!updatedKey) {
      throw new NotFoundException(`Key with value ${keyValue} not found`);
    }
    await this.kafkaService.sendMessage(kafkaEvents.KEY_DISABLED, updatedKey);
    return updatedKey;
  }
}
