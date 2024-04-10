import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, Startup } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    // Generate the password hash
    const hash = await argon.hash(dto.password);

    try {
      // Save the new user in the DB
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
        },
      });

      delete user.password;

      // Return the saved user
      return user;
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

  async signin(dto: AuthDto) {
    try {
      // Find the user by email
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
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

      // Remove the password from the user object
      delete user.password;

      // Return the user
      return user;
    } catch (error) {
      throw error;
    }
  }
}
