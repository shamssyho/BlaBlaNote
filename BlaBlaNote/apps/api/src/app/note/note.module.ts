import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { DiscordModule } from '../discord/discord.module';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [PrismaModule, AuthModule, DiscordModule, ProjectModule],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
