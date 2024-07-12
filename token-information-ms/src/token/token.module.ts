import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './schemas/token.schema';
import { TokenController } from './controller/token.controller';
import { TokenService } from './services/token.service';
import { Log, LogSchema } from './schemas/log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
  ],
  providers: [TokenService],
  controllers: [TokenController],
})
export class TokenModule {}
