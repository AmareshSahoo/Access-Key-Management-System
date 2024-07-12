import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kafka.module';
import { KeyModule } from './key/key.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthModule } from './auth/jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}`, '.env'],
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongoUri'),
      }),
      inject: [ConfigService],
    }),
    KeyModule,
    KafkaModule,
    JwtAuthModule
  ],
})

export class AppModule {}