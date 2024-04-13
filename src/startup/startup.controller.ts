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

@Controller('startups')
export class StartupController {
  constructor(private startupService: StartupService) {}

  @UseGuards()
  @Post('add')
  async createStartup(
    @Body(ValidationPipe) createStartupDto: CreateStartupDto,
    @Req() req,
  ) {
    console.log('----------User from create startup method:', req.user);
    const userId = req.user.id;

    return this.startupService.createStartup(createStartupDto, userId);
  }

  @Get('my-startups')
  async getStartups(@Req() req) {
    const userId = req.user.id;
    return this.startupService.myStartups(userId);
  }

  @Get('/')
  async startups() {
    return this.startupService.startups();
  }
}
