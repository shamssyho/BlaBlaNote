import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class ReplaceNoteTagsDto {
  @ApiProperty({
    type: [String],
    description: 'List of tag ids to attach to the note',
  })
  @IsArray()
  @IsString({ each: true })
  tagIds: string[];
}
