import { Module } from '@nestjs/common';
import { KafkaService } from './services/kafka.service';

@Module({
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
