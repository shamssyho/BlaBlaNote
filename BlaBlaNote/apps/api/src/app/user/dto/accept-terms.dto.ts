import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AcceptTermsDto {
  @ApiPropertyOptional({ example: 'v1.0' })
  @IsString()
  @IsOptional()
  termsVersion?: string;
}
