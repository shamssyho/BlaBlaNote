import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateNoteProjectDto {
  @ApiProperty({ nullable: true, type: String })
  @IsOptional()
  @IsString()
  @IsUUID()
  projectId: string | null;
}
