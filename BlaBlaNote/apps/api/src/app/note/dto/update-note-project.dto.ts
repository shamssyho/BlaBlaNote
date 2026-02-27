import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, Matches, ValidateIf } from 'class-validator';

export class UpdateNoteProjectDto {
  @ApiProperty({
    nullable: true,
    type: String,
    example: 'cm7l8f9xw0001v1r8z2b4m6n0',
  })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @ValidateIf((_, value) => value !== null)
  @Matches(/^c[a-z0-9]{24}$/)
  projectId: string | null;
}
