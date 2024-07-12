import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { TokenService } from '../services/token.service';

@Controller('tokens')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get(':keyValue')
  async getTokenInformation(@Param('keyValue') keyValue: string) {
    try {
      return await this.tokenService.getTokenInformation(keyValue);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
