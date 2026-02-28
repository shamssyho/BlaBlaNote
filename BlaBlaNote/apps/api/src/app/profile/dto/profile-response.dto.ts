import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  role!: string;

  @ApiProperty()
  isBlocked!: boolean;

  @ApiProperty({ nullable: true })
  avatarUrl!: string | null;

  @ApiProperty()
  language!: string;

  @ApiProperty({ enum: ['light', 'dark'] })
  theme!: 'light' | 'dark';

  @ApiProperty()
  notificationsEnabled!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
