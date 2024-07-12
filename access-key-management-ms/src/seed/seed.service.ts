import { KeyService } from './../key/services/key.service';
import { CreateKeyDto } from './../key/dto/create-key.dto';

import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private readonly keyService: KeyService) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    const mockKeys: CreateKeyDto[] = [
      {
        keyValue: 'key1',
        rateLimit: 1000,
        expirationTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 1 day from now
        isDisabled: false,
      },
      {
        keyValue: 'key2',
        rateLimit: 500,
        expirationTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days from now
        isDisabled: false,
      },
      {
        keyValue: 'key3',
        rateLimit: 750,
        expirationTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days from now
        isDisabled: true,
      },
    ];

    for (const key of mockKeys) {
      await this.keyService.create(key);
    }

    console.log('Seed data has been added to the database');
  }
}
