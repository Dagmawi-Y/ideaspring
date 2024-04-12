// entrepreneur.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '../enums/role.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId: user.id },
      include: { role: true },
    });

    return userRoles.some((userRole) =>
      requiredRoles.includes(userRole.role.name as Role),
    );
  }
}
