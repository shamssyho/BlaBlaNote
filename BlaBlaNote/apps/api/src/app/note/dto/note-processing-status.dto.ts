import { NoteStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NoteProcessingStatusDto {
  @ApiProperty({ example: 'fdd3bbd4-cf51-4ad9-ae60-4e4813158a5b' })
  id: string;

  @ApiProperty({ enum: NoteStatus, enumName: 'NoteStatus' })
  status: NoteStatus;

  @ApiPropertyOptional({
    example: 'Failed to transcribe or summarize audio',
  })
  errorMessage?: string | null;
}
