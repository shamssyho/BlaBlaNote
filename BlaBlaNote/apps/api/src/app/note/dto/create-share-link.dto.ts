import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, Max, Min } from 'class-validator';

export class CreateShareLinkDto {
  @ApiProperty({ example: 24, minimum: 1, maximum: 720 })
  @IsInt()
  @Min(1)
  @Max(720)
  expiresInHours: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  allowSummary: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  allowTranscript: boolean;
}
