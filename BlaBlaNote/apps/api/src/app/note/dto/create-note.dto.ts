import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiPropertyOptional({ description: 'The text content of the note' })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional({
    description: 'Optional audio URL associated with the note',
  })
  @IsOptional()
  @IsString()
  audioUrl?: string;
}
