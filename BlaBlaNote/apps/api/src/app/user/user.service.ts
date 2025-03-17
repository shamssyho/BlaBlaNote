import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const { firstName, lastName, email, password } = dto;
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (existingUser) throw new ConflictException('Email already in use');
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: { firstName, lastName, email, password: hashedPassword },
    });
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email: email } });
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (dto.password) dto.password = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.update({ where: { id }, data: dto });
  }
  async updateUserRole(id: string, role: 'ADMIN' | 'USER') {
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.delete({ where: { id } });
  }
}
