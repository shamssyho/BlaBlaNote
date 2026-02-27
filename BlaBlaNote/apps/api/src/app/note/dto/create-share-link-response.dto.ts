import { ApiProperty } from '@nestjs/swagger';

export class CreateShareLinkResponseDto {
  @ApiProperty({ example: 'http://localhost:3001/public/notes/token' })
  publicUrl: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  expiresAt: Date;
}
