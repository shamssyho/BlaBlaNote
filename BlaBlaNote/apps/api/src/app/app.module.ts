import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { NoteModule } from './note/note.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, NoteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
