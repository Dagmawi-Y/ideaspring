import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto';
import { SignInDto } from './dto/signIn.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: 200,
    description: 'Returns a user objects who signed up.',
    type: [SignupDto],
  })
  signup(@Body() dto: SignupDto) {
    return this.authService.register(dto);
  }

  @ApiResponse({
    status: 200,
    description: 'Returns a user who signed in.',
    type: [SignInDto],
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signin(@Body() dto: SignInDto) {
    return this.authService.login(dto);
  }
}
