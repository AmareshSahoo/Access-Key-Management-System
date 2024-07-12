import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Key, KeySchema } from './schemas/key.schema';
import { KafkaModule } from '../kafka/kafka.module';
import { KeyController } from './controller/key.controller';
import { KeyService } from './services/key.service';
import { SeedService } from 'src/seed/seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Key.name, schema: KeySchema }]),
    KafkaModule,
  ],
  controllers: [KeyController],
  providers: [
    KeyService,
    SeedService
  ],
})
export class KeyModule {}
