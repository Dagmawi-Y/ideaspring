import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RevokedTokenGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    // Check if the token has been revoked
    const revokedToken = await this.prisma.revokedToken.findUnique({
      where: { token },
    });

    if (revokedToken) {
      throw new UnauthorizedException('Token has been revoked');
    }

    return true; // Allow the request to proceed
  }
}
