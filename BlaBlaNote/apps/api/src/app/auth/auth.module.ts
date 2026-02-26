import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { jwtConstants } from './auth.constants';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { DiscordModule } from '../discord/discord.module';
import { RefreshTokenService } from './refresh-token.service';
import { MailerService } from './mailer.service';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.accessExpiresIn },
    }),
    DiscordModule,
  ],
  providers: [AuthService, JwtStrategy, RefreshTokenService, MailerService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
