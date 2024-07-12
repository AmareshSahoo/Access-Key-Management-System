import { kafkaEvents } from '../constants/kafka-events.constants';
import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { Kafka, EachMessagePayload } from 'kafkajs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from '../token/schemas/token.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: Kafka,
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
    private configService: ConfigService
  ) {}

  async onModuleInit() {
    const consumer = this.kafkaClient.consumer({ groupId: this.configService.get<string>('kafka.consumerGroupId')});
    await consumer.connect();
    await consumer.subscribe({ topic: kafkaEvents.KEY_CREATED, fromBeginning: true });
    await consumer.subscribe({ topic: kafkaEvents.KEY_UPDATED, fromBeginning: true });
    await consumer.subscribe({ topic: kafkaEvents.KEY_DELETED, fromBeginning: true });
    await consumer.subscribe({ topic: kafkaEvents.KEY_DISABLED, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, message }: EachMessagePayload) => {
        console.log("===KAFKA CONSUMER===", topic);
        const payload = JSON.parse(message.value.toString());
        switch (topic) {
          case kafkaEvents.KEY_CREATED:
            await this.createToken(payload);
            break;
          case kafkaEvents.KEY_UPDATED:
            await this.updateToken(payload);
            break;
          case kafkaEvents.KEY_DELETED:
            await this.deleteToken(payload);
            break;
          case kafkaEvents.KEY_DISABLED:
            await this.disableToken(payload);
            break;
          default:
            break;
        }
      },
    });
  }

  async createToken(payload: any) {
    const createdToken = new this.tokenModel(payload);
    await createdToken.save();
  }

  async updateToken(payload: any) {
    console.log("===payload===", payload);
    await this.tokenModel.findOneAndUpdate({ keyValue: payload.keyValue }, {...payload}, { upsert: true, new: true });
  }

  async deleteToken(payload: any) {
    await this.tokenModel.findOneAndDelete({ keyValue: payload.keyValue });
  }

  async disableToken(payload: any) {
    await this.tokenModel.findOneAndUpdate({ keyValue: payload.keyValue }, { disabled: true });
  }
}
