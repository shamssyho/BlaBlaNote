import { Controller, Post, Body, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('users')
export class UserController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async createUser(
    @Body()
    data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }
  ) {
    return this.prisma.user.create({ data });
  }

  @Get()
  async getUsers() {
    return this.prisma.user.findMany();
  }
}
