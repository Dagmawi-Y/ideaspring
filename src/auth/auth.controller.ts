import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto';
import { SignInDto } from './dto/signIn.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { RevokedTokenGuard } from './guard/revoked_token.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: SignupDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request. Check request body.' })
  signup(@Body() dto: SignupDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login an existing user' })
  @ApiOkResponse({
    description: 'The user has been successfully logged in.',
    type: SignInDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request. Check credentials.' })
  @HttpCode(HttpStatus.OK)
  signin(@Body() dto: SignInDto) {
    return this.authService.login(dto);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify a user email' })
  @ApiOkResponse({ description: 'Email verification successful.' })
  @ApiBadRequestResponse({ description: 'Bad Request. Invalid token.' })
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Initiate password reset process' })
  @ApiOkResponse({
    description: 'Password reset email sent.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request. Invalid email.' })
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiOkResponse({ description: 'Password reset successfully.' })
  @ApiBadRequestResponse({
    description: 'Bad Request. Invalid token or password.',
  })
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }

  @UseGuards(AuthGuard('jwt'), RevokedTokenGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Logout a user' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User logged out successfully.' })
  @HttpCode(HttpStatus.OK)
  async logout(@Req() request: Request) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    await this.authService.logout(token);
    return {
      msg: 'User logged out - Token Revoked',
    };
  }
}
