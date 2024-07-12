import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Token } from '../schemas/token.schema';
import { Log } from '../schemas/log.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  private rateLimiters: Map<string, RateLimiterMemory>;
  private readonly logger = new Logger(TokenService.name);

  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
    @InjectModel(Log.name) private readonly logModel: Model<Log>,
    private configService: ConfigService
  ) {
    this.rateLimiters = new Map<string, RateLimiterMemory>();
  }

  async findOne(keyValue: string): Promise<Token> {
    const token = await this.tokenModel.findOne({ keyValue }).exec();
    if (token && !this.rateLimiters.has(keyValue)) {
      this.initializeRateLimiter(keyValue, token.rateLimit);
    }
    return token;
  }

  async getTokenInformation(keyValue: string) {
    const timestamp = new Date();
    try {
      const token = await this.findOne(keyValue);
      if (!token) {
        this.logRequest(keyValue, timestamp, false, 'Invalid key');
        throw new Error('Invalid key');
      }

      if (new Date(token.expirationTime) <= new Date()) {
        this.logRequest(keyValue, timestamp, false, 'Key expired');
        throw new Error('Key expired');
      }

      if (token.disabled) {
        this.logRequest(keyValue, timestamp, false, 'Key disabled');
        throw new Error('Key disabled');
      }

      const rateLimiter = this.rateLimiters.get(keyValue);
      if (!rateLimiter) {
        this.logRequest(keyValue, timestamp, false, 'Rate limiter not initialized');
        throw new Error('Rate limiter not initialized');
      }

      await rateLimiter.consume(keyValue);

      const tokenInfo = await this.fetchTokenInfoFromCoinGecko();
      this.logRequest(keyValue, timestamp, true, 'Request successful');
      return {
        keyValue: token.keyValue,
        rateLimit: token.rateLimit,
        expirationTime: token.expirationTime,
        tokenInfo,
      };
    } catch (error) {
      if (error.message === 'Rate limit exceeded') {
        this.logRequest(keyValue, timestamp, false, 'Rate limit exceeded');
      } else {
        this.logRequest(keyValue, timestamp, false, error.message);
      }
      throw error;
    }
  }

  private initializeRateLimiter(keyValue: string, rateLimit: number) {
    this.rateLimiters.set(keyValue, new RateLimiterMemory({
      points: rateLimit,
      duration: 60,
    }));
  }

  private async fetchTokenInfoFromCoinGecko(): Promise<any> {
    try {
      const response = await axios.get(this.configService.get<string>('api.coinGeckoApi'));
      return {
        name: response.data.name,
        symbol: response.data.symbol,
        price_usd: response.data.market_data.current_price.usd,
        market_cap_usd: response.data.market_data.market_cap.usd,
      };
    } catch (error) {
      this.logger.error(`Error fetching token info from CoinGecko: ${error.message}`);
      throw new Error('Failed to fetch token information from external API');
    }
  }

  private async logRequest(key: string, timestamp: Date, success: boolean, message: string) {
    const logMessage = `Key: ${key}, Timestamp: ${timestamp.toISOString()}, Success: ${success}, Message: ${message}`;
    this.logger.log(logMessage);

    // Save the log to the database
    const log = new this.logModel({
      key,
      timestamp,
      success,
      message,
    });
    await log.save();
  }
}
