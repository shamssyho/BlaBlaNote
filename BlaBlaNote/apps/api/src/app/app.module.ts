import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { NoteModule } from './note/note.module';
import { WhisperModule } from './whisper/whisper.module';
import { DiscordModule } from './discord/discord.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    NoteModule,
    WhisperModule,
    DiscordModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
