import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateStartupDto } from './dto';
import { StartupService } from './startup.service';
import { JwtGuard } from '../auth/guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { GetUser } from '../auth/decorator';
import { UpdateStartupDto } from './dto/updateStartup.dto';
import { InvestorService } from '../investor/investor.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Startups')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Controller('startups')
export class StartupController {
  constructor(
    private startupService: StartupService,
    private investorService: InvestorService,
  ) {}

  @Post('add')
  @Roles('entrepreneur')
  @ApiOperation({ summary: 'Create a new startup' })
  @ApiCreatedResponse({
    description: 'Startup created successfully.',
    type: CreateStartupDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request. Invalid input data.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden. User must be an entrepreneur.',
  })
  async createStartup(
    @Body(ValidationPipe) createStartupDto: CreateStartupDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.startupService.createStartup(createStartupDto, userId);
  }

  @Get('me')
  @Roles('entrepreneur')
  @ApiOperation({ summary: 'Get startups created by the current user' })
  @ApiOkResponse({ description: 'Startups retrieved successfully.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden. User must be an entrepreneur.',
  })
  getMyStartups(@GetUser('id') userId: number) {
    return this.startupService.getMyStartups(userId);
  }

  @Get(':id')
  @Roles('entrepreneur', 'investor', 'engager', 'admin')
  @ApiOperation({ summary: 'Get a startup by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the startup' })
  @ApiOkResponse({ description: 'Startup retrieved successfully.' })
  @ApiNotFoundResponse({ description: 'Startup not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden. User must have appropriate role (entrepreneur, investor, engager, or admin).',
  })
  getStartupById(@Param('id', ParseIntPipe) id: number) {
    return this.startupService.getStartupById(id);
  }

  @Put(':id')
  @Roles('entrepreneur')
  @ApiOperation({ summary: 'Update a startup' })
  @ApiParam({ name: 'id', description: 'The ID of the startup to update' })
  @ApiOkResponse({ description: 'Startup updated successfully.' })
  @ApiBadRequestResponse({ description: 'Bad Request. Invalid input data.' })
  @ApiNotFoundResponse({ description: 'Startup not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden. User must be the creator of the startup.',
  })
  updateStartup(
    @Param('id') id: string,
    @Body() updateStartupDto: UpdateStartupDto,
    @GetUser('id') userId: number,
  ) {
    return this.startupService.updateStartup(
      parseInt(id, 10),
      updateStartupDto,
      userId,
    );
  }

  @Delete(':id')
  @Roles('entrepreneur')
  @ApiOperation({ summary: 'Delete a startup' })
  @ApiParam({ name: 'id', description: 'The ID of the startup to delete' })
  @ApiOkResponse({ description: 'Startup deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Startup not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden. User must be the creator of the startup.',
  })
  deleteStartup(@Param('id') id: string, @GetUser('id') userId: number) {
    return this.startupService.deleteStartup(parseInt(id, 10), userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of all startups' })
  @ApiOkResponse({ description: 'Startups retrieved successfully.' })
  async getAllStartups() {
    return this.startupService.getAllStartups();
  }

  @Post(':id/interest')
  @Roles('investor')
  @ApiOperation({ summary: 'Express interest in a startup as an investor' })
  @ApiParam({ name: 'id', description: 'The ID of the startup' })
  @ApiCreatedResponse({ description: 'Interest expressed successfully.' })
  @ApiNotFoundResponse({ description: 'Investor or startup not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  async showInterest(
    @GetUser('id') id: number,
    @Param('id', ParseIntPipe) startupId: number,
  ) {
    const userId = id;
    return this.startupService.showInterest(userId, startupId);
  }
}
