import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class ProfileStorageService {
  private readonly uploadBaseUrl = process.env.S3_UPLOAD_BASE_URL || '';
  private readonly publicBaseUrl = process.env.S3_PUBLIC_BASE_URL || '';
  private readonly uploadToken = process.env.S3_UPLOAD_TOKEN || '';

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    if (!this.uploadBaseUrl || !this.publicBaseUrl) {
      throw new BadRequestException('S3 storage configuration is incomplete');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    const extension = file.originalname.includes('.')
      ? file.originalname.split('.').pop()?.toLowerCase()
      : 'jpg';
    const key = `avatars/${userId}/${randomUUID()}.${extension}`;
    const uploadUrl = `${this.uploadBaseUrl.replace(/\/$/, '')}/${key}`;

    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.mimetype,
        ...(this.uploadToken ? { Authorization: `Bearer ${this.uploadToken}` } : {}),
      },
      body: file.buffer,
    });

    if (!response.ok) {
      throw new BadRequestException('Avatar upload failed');
    }

    return `${this.publicBaseUrl.replace(/\/$/, '')}/${key}`;
  }
}
