import { ApiProperty } from '@nestjs/swagger';

class ExportTagDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

class ExportShareLinkMetadataDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  noteId: string;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty()
  allowSummary: boolean;

  @ApiProperty()
  allowTranscript: boolean;

  @ApiProperty()
  createdAt: Date;
}

class ExportProjectDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

class ExportNoteDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false, nullable: true })
  projectId: string | null;

  @ApiProperty()
  text: string;

  @ApiProperty({ required: false, nullable: true })
  transcriptText: string | null;

  @ApiProperty()
  status: string;

  @ApiProperty({ required: false, nullable: true })
  errorMessage: string | null;

  @ApiProperty({ required: false, nullable: true })
  summary: string | null;

  @ApiProperty({ required: false, nullable: true })
  translation: string | null;

  @ApiProperty({ required: false, nullable: true })
  audioUrl: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: () => [ExportTagDto] })
  tags: ExportTagDto[];

  @ApiProperty({ type: () => [ExportShareLinkMetadataDto] })
  shareLinks: ExportShareLinkMetadataDto[];
}

class ExportUserProfileDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ required: false, nullable: true })
  termsAcceptedAt: Date | null;

  @ApiProperty({ required: false, nullable: true })
  termsVersion: string | null;

  @ApiProperty({ required: false, nullable: true })
  lastLoginAt: Date | null;

  @ApiProperty({ required: false, nullable: true })
  suspendedAt: Date | null;

  @ApiProperty({ required: false, nullable: true })
  deletedAt: Date | null;

  @ApiProperty({ required: false, nullable: true })
  plan: string | null;

  @ApiProperty({ required: false, nullable: true })
  priceCents: number | null;

  @ApiProperty({ required: false, nullable: true })
  currency: string | null;

  @ApiProperty({ required: false, nullable: true })
  billingStatus: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ExportUserDataDto {
  @ApiProperty({ type: () => ExportUserProfileDto })
  profile: ExportUserProfileDto;

  @ApiProperty({ type: () => [ExportNoteDto] })
  notes: ExportNoteDto[];

  @ApiProperty({ type: () => [ExportProjectDto] })
  projects: ExportProjectDto[];

  @ApiProperty({ type: () => [ExportTagDto] })
  tags: ExportTagDto[];

  @ApiProperty({ type: () => [ExportShareLinkMetadataDto] })
  shareLinks: ExportShareLinkMetadataDto[];
}
