import { Injectable } from '@nestjs/common';
import { users, startups, investors } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  signup() {
    return {
      msg: 'you signed up',
    };
  }

  signin() {
    return {
      msg: 'you signed in',
    };
  }
}
