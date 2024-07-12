import { ResponseInterceptor } from './../../interceptors/response.interceptor';
import {
  Controller, Get, Post, Body, Param, Delete, Put, BadRequestException, UsePipes, ValidationPipe, UseInterceptors,
} from '@nestjs/common';
import { KeyService } from '../services/key.service';
import { CreateKeyDto } from '../dto/create-key.dto';
import { UpdateKeyDto } from '../dto/update-key.dto';
import Auth from './../../decorators/auth.decorator';
import { RolesEnum } from './../../decorators/roles.decorator';


@Controller('keys')
export class KeyController {
  constructor(private readonly keyService: KeyService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Auth(RolesEnum.ADMIN) // Requires ADMIN role to create keys
  async create(@Body() createKeyDto: CreateKeyDto) {
    if (new Date(createKeyDto.expirationTime) <= new Date()) {
      throw new BadRequestException('Expiration time must be in the future');
    }
    return this.keyService.create(createKeyDto);
  }

  @Get()
  @Auth(RolesEnum.ADMIN)
  @UseInterceptors(ResponseInterceptor)
  @Reflect.metadata('message', 'Fetched Successfully...')
  findAll() {
    console.log("====Called=======");
    return this.keyService.findAll();
  }

  @Get(':keyValue')
  @Auth(RolesEnum.USER)
  findOne(@Param('keyValue') keyValue: string) {
    return this.keyService.findOne(keyValue);
  }

  @Put(':keyValue')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Auth(RolesEnum.ADMIN) // Requires ADMIN role to update a key
  update(@Param('keyValue') keyValue: string, @Body() updateKeyDto: UpdateKeyDto) {
    return this.keyService.update(keyValue, updateKeyDto);
  }

  @Delete(':keyValue')
  @Auth(RolesEnum.ADMIN) // Requires ADMIN role to delete a key
  remove(@Param('keyValue') keyValue: string) {
    return this.keyService.remove(keyValue);
  }

  @Put(':keyValue/disable')
  @Auth(RolesEnum.ADMIN) // Requires ADMIN role to disable a key
  disableKey(@Param('keyValue') keyValue: string) {
    return this.keyService.disableKey(keyValue);
  }
}
