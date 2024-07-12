import { IsString, IsInt, IsDateString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateKeyDto {
  @IsString()
  @IsNotEmpty()
  readonly keyValue: string;

  @IsInt()
  readonly rateLimit: number;

  @IsDateString()
  readonly expirationTime: string;

  @IsBoolean()
  @IsOptional()
  isDisabled: boolean;
}
