import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { MeController } from './me.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UserController, MeController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
