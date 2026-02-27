import { ApiProperty } from '@nestjs/swagger';

export class ShareHistoryItemDto {
  @ApiProperty({ example: 'cmabc123' })
  id: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  expiresAt: Date;

  @ApiProperty({ example: true })
  allowSummary: boolean;

  @ApiProperty({ example: true })
  allowTranscript: boolean;

  @ApiProperty({ example: '2025-12-31T00:00:00.000Z' })
  createdAt: Date;
}
