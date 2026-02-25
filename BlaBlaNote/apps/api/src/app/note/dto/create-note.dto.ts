import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty({ description: 'The text content of the note' })
  @IsString()
  text: string;

  @ApiPropertyOptional({
    description: 'Optional audio URL associated with the note',
  })
  @IsOptional()
  @IsString()
  audioUrl?: string;
}
