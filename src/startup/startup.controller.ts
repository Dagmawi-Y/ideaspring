import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateStartupDto } from './dto';
import { StartupService } from './startup.service';
import { JwtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';

@UseGuards(JwtGuard)
@Controller('startups')
export class StartupController {
  constructor(private startupService: StartupService) {}

  @Roles('entrepreneur')
  @UseGuards(RolesGuard)
  @Post('add')
  async createStartup(
    @Body(ValidationPipe) createStartupDto: CreateStartupDto,
    @Req() req,
  ) {
    console.log('request object: ', req.user);
    const userId = await req.user.id;

    return this.startupService.createStartup(createStartupDto, userId);
  }


}
