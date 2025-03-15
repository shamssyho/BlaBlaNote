import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
// t

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
