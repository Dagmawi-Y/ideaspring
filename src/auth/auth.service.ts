import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto/signIn.dto';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: SignupDto) {
    // Generate the password hash
    const hash = await argon.hash(dto.password);

    try {
      // Save the new user in the DB
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
          first_name: dto.first_name,
          last_name: dto.last_name,
        },
      });

      const role = await this.prisma.role.findUnique({
        where: {
          name: dto.role,
        },
      });

      if (!role) {
        throw new BadRequestException(`Role ${dto.role} does not exist.`);
      }

      await this.prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: role.id,
        },
      });

      // Return the saved user
      return this.signToken(user.id, user.email, role.name);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Username already in use. please try another one',
          );
        }
      }
      throw error;
    }
  }

  async login(dto: SignInDto) {
    try {
      // Find the user by email
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
        include: { userRole: { include: { role: true } } },
      });

      // If the user is not found, throw an error
      if (!user) {
        throw new ForbiddenException('User not found');
      }

      // Check the password
      const isPasswordCorrect = await argon.verify(user.password, dto.password);

      // If the password is not correct, throw an error
      if (!isPasswordCorrect) {
        throw new ForbiddenException('Invalid credentials');
      }

      // Get the user's role
      const role = user.userRole?.role;

      // Return the user
      return this.signToken(user.id, user.email, role?.name ?? '');
    } catch (error) {
      throw error;
    }
  }

  async signToken(
    userId: number,
    email: string,
    role: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
      role,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
