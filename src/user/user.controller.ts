import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  @Roles('engager')
  @UseGuards(RolesGuard)
  getMe(@GetUser() user: User, @Req() req: any) {
    // const role = req.user.role;
    return {
      user: user,
      // role: role,
    };
  }
}
