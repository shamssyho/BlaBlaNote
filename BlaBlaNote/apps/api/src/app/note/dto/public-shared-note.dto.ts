import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PublicSharedNoteDto {
  @ApiProperty({ example: 'note-id' })
  noteId: string;

  @ApiPropertyOptional({ example: 'Summary text' })
  summary?: string;

  @ApiPropertyOptional({ example: 'Transcript text' })
  transcriptText?: string;
}
