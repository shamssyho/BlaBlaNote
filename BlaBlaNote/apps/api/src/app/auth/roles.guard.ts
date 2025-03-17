import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler()
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) throw new ForbiddenException('No token provided');

    const token = authHeader.split(' ')[1];
    const decoded = this.jwtService.verify(token);

    if (!decoded || !decoded.role || !requiredRoles.includes(decoded.role)) {
      throw new ForbiddenException('You do not have permission');
    }

    request.user = decoded;
    return true;
  }
}
