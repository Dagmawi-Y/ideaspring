import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const userRole = user?.role?.name;

    // Check if the user's role is included in the required roles array
    return requiredRoles.includes(userRole);
  }
}

// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { ROLES_KEY } from '../decorator/roles.decorator';
// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     console.log('-----------context from roles guard', context.getHandler());
//     const requiredRoles = this.reflector.getAllAndOverride<string[]>(
//       ROLES_KEY,
//       [context.getHandler(), context.getClass()],
//     );

//     if (!requiredRoles) {
//       return true;
//     }

//     const { user } = context.switchToHttp().getRequest();
//     const userRole = user?.role?.name;

//     console.log('RolesGuard canActivate');
//     console.log('User:', user);
//     console.log('Required roles:', requiredRoles);

//     return requiredRoles.some((role) => role === userRole);
//   }
// }

//Permissions implementation - for the future

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector, private prisma: PrismaService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);

//     if (!requiredRoles) {
//       return true;
//     }

//     const { user } = context.switchToHttp().getRequest();
//     const userRole = user?.role?.name;

//     // Check if the user's role matches the required roles
//     const hasRoleAccess = requiredRoles.some((role) => role === userRole);
//     if (!hasRoleAccess) {
//       return false;
//     }

//     // If the user's role matches, check if they have the required permissions
//     const userPermissions = await this.getUserPermissions(user.id);
//     const requiredPermissions = this.reflector.getAllAndOverride<string[]>('permissions', [
//       context.getHandler(),
//       context.getClass(),
//     ]);

//     if (requiredPermissions) {
//       return requiredPermissions.every((permission) => userPermissions.includes(permission));
//     }

//     return true;
//   }

//   private async getUserPermissions(userId: number): Promise<string[]> {
//     const user = await this.prisma.user.findUnique({
//       where: { id: userId },
//       include: {
//         userRole: {
//           include: {
//             role: {
//               include: {
//                 permissions: {
//                   include: {
//                     permission: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     });

//     const permissions = user?.userRole?.role?.permissions.flatMap((rolePermission) =>
//       rolePermission.permission.name,
//     );

//     return permissions || [];
//   }
// }
