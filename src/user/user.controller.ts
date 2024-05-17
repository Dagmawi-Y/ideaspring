import { Controller, Delete, Get, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role, User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { UserService } from './user.service';
import { RevokedTokenGuard } from '../auth/guard/revoked_token.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth() // Indicate that all endpoints require a Bearer token
@UseGuards(JwtGuard, RevokedTokenGuard) // Ensure user is logged in and token is not revoked
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get the current user profile' })
  @ApiOkResponse({ description: 'User profile retrieved successfully.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  getUserProfile(@GetUser() user: User) {
    const userId = user.id;
    return this.userService.getUserProfile(userId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update the current user profile' })
  @ApiOkResponse({ description: 'User profile updated successfully.' })
  @ApiBadRequestResponse({ description: 'Bad Request. Invalid input data.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  updateUserProfile(@GetUser() user: User, @Req() req: any) {
    const userId = user.id;
    const data = req.body;
    return this.userService.updateUserProfile(userId, data);
  }

  @Delete('profile')
  @ApiOperation({ summary: 'Delete the current user profile' })
  @ApiOkResponse({ description: 'User profile deleted successfully.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  deleteUserProfile(@GetUser() user: User) {
    const userId = user.id;
    return this.userService.deleteUserProfile(userId);
  }
}
