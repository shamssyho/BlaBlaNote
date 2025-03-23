import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { WhisperService } from './whisper.service';
import { WhisperController } from './whisper.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const fileExtName = extname(file.originalname);
          const randomName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${randomName}${fileExtName}`);
        },
      }),
    }),
    PrismaModule,
    AuthModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  controllers: [WhisperController],
  providers: [WhisperService],
})
export class WhisperModule {}
