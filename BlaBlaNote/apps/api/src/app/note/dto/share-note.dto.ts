import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ShareChannel, ShareContentType } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class ShareNoteDto {
  @ApiProperty({ enum: ShareChannel })
  @IsEnum(ShareChannel)
  channel: ShareChannel;

  @ApiProperty({ example: 'recipient@example.com' })
  @IsString()
  @MinLength(1)
  destination: string;

  @ApiProperty({ enum: ShareContentType })
  @IsEnum(ShareContentType)
  contentType: ShareContentType;

  @ApiPropertyOptional({ example: 'fr' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  targetLanguage?: string;
}
