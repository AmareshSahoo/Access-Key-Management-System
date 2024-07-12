import { Module } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from '../token/schemas/token.schema';
import { KafkaConsumerService } from './kafka-consumer.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
  providers: [
    KafkaConsumerService,
    {
      provide: 'KAFKA_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const kafka = new Kafka({
          brokers: [configService.get<string>('kafka.broker')],
        });
        return kafka;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['KAFKA_CLIENT'],
})
export class KafkaModule {}
