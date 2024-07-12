import { IsInt, IsDateString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateKeyDto {
  @IsOptional()
  @IsInt()
  readonly rateLimit?: number;

  @IsOptional()
  @IsDateString()
  readonly expirationTime?: string;

  @IsBoolean()
  @IsOptional()
  isDisabled: boolean;
}
