import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }
  async validate(payload: { sub: number; email: string; role: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    const role = await this.prisma.role.findUnique({
      where: {
        name: payload.role,
      },
    });

    if (role) {
      const userRole = await this.prisma.userRole.findUnique({
        where: {
          userId_roleId: {
            userId: user.id,
            roleId: role.id,
          },
        },
      });

      if (!userRole) {
        await this.prisma.userRole.create({
          data: {
            userId: user.id,
            roleId: role.id,
          },
        });
      }
    }

    console.log(payload);
    delete user.password;
    return { ...user, role: payload.role };
  }
}
