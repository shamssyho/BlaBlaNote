import { ApiProperty } from '@nestjs/swagger';

export class GetNotesResponseDto {
  @ApiProperty({ type: 'array', items: { type: 'object' } })
  items: Record<string, unknown>[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  pageSize: number;

  @ApiProperty({ example: 42 })
  total: number;
}
