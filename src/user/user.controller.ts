import { Controller, Delete, Get, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserService } from './user.service';
import { RevokedTokenGuard } from 'src/auth/guard/revoked_token.guard';

@UseGuards(JwtGuard, RevokedTokenGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  getUserProfile(@GetUser() user: User, @Req() req: any) {
    const userId = user.id;
    return this.userService.getUserProfile(userId);
  }

  @Put('profile')
  updateUserProfile(@GetUser() user: User, @Req() req: any) {
    const userId = user.id;
    console.log(userId);
    const data = req.body;
    return this.userService.updateUserProfile(userId, data);
  }

  @Delete('profile')
  deleteUserProfile(@GetUser() user: User, @Req() req: any) {
    const userId = user.id;
    return this.userService.deleteUserProfile(userId);
  }
}
