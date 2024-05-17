import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true, // for dev
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string; role: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        userRole: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      // Handle user not found case
      return null;
    }

    const role = user.userRole?.role;

    return {
      id: user.id,
      email: user.email,
      role,
    };
  }
}

// Attaches Role and Permissions - For future implementation
// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { Permission, Roles } from '../enums/role.enum';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
//   constructor(
//     config: ConfigService,
//     private prisma: PrismaService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: true, // for dev
//       secretOrKey: config.get('JWT_SECRET'),
//     });
//   }

//   async validate(payload: { sub: number; email: string; role: string }) {
//     const user = await this.prisma.user.findUnique({
//       where: { id: payload.sub },
//       include: {
//         userRole: {
//           include: {
//             role: {
//               include: {
//                 permissions: {
//                   include: {
//                     permission: true, // Include the Permission record
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!user) {
//       // Handle user not found case
//       return null;
//     }

//     const role = user.userRole?.role;
//     const permissions = await Promise.all(
//       role?.permissions.map(async (rolePerm) => {
//         const permission = await this.prisma.permission.findUnique({
//           where: { id: rolePerm.permissionId },
//         });
//         return permission?.name as Permission;
//       }) ?? [],
//     );

//     return {
//       id: user.id,
//       email: user.email,
//       role: role?.name as Roles,
//       permissions,
//     };
//   }
// }
