import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { CreateStartupDto } from './dto';
import { StartupService } from './startup.service';
import { EntrepreneurGuard } from 'src/auth/guard/entrepreneur.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('startups')
export class StartupController {
  constructor(private startupService: StartupService) {}

  @UseGuards(JwtGuard, EntrepreneurGuard)
  @Roles(Role.Entrepreneur)
  @Post()
  async createStartup(
    @Body(ValidationPipe) createStartupDto: CreateStartupDto,
    @Req() req,
  ) {
    const userId = req.user.id;

    return this.startupService.createStartup(createStartupDto, userId);
  }
}
