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
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DealDetails, PitchDeal, Team } from '@prisma/client';

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

  // ... (existing imports and code)

  @Put(':id/team')
  @Roles('entrepreneur')
  @ApiOperation({ summary: 'Update the team members for a startup' })
  @ApiParam({ name: 'id', description: 'The ID of the startup' })
  @ApiOkResponse({ description: 'Team members updated successfully.' })
  @ApiBadRequestResponse({ description: 'Bad Request. Invalid input data.' })
  @ApiNotFoundResponse({ description: 'Startup not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden. User must be the creator of the startup.',
  })
  async updateTeamMembers(
    @Param('id') id: string,
    @Body() teamMembers: Team[],
    @GetUser('id') userId: number,
  ) {
    return this.startupService.updateTeamMembers(
      parseInt(id, 10),
      teamMembers,
      userId,
    );
  }

  @Put(':id/deal-details')
  @Roles('entrepreneur')
  @ApiOperation({ summary: 'Update the deal details for a startup' })
  @ApiParam({ name: 'id', description: 'The ID of the startup' })
  @ApiOkResponse({ description: 'Deal details updated successfully.' })
  @ApiBadRequestResponse({ description: 'Bad Request. Invalid input data.' })
  @ApiNotFoundResponse({ description: 'Startup not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden. User must be the creator of the startup.',
  })
  async updateDealDetails(
    @Param('id') id: string,
    @Body() dealDetails: DealDetails,
    @GetUser('id') userId: number,
  ) {
    return this.startupService.updateDealDetails(
      parseInt(id, 10),
      dealDetails,
      userId,
    );
  }

  @Put(':id/pitch-deal')
  @Roles('entrepreneur')
  @ApiOperation({ summary: 'Update the pitch deal for a startup' })
  @ApiParam({ name: 'id', description: 'The ID of the startup' })
  @ApiOkResponse({ description: 'Pitch deal updated successfully.' })
  @ApiBadRequestResponse({ description: 'Bad Request. Invalid input data.' })
  @ApiNotFoundResponse({ description: 'Startup not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden. User must be the creator of the startup.',
  })
  async updatePitchDeal(
    @Param('id') id: string,
    @Body() pitchDeal: PitchDeal,
    @GetUser('id') userId: number,
  ) {
    return this.startupService.updatePitchDeal(
      parseInt(id, 10),
      pitchDeal,
      userId,
    );
  }

  @Post(':id/upvote')
  @Roles('entrepreneur', 'investor', 'engager')
  @ApiOperation({ summary: 'Upvote or remove upvote for a startup' })
  @ApiParam({ name: 'id', description: 'The ID of the startup' })
  @ApiOkResponse({ description: 'Upvote status updated successfully.' })
  @ApiNotFoundResponse({ description: 'Startup not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden. User must have the appropriate role.',
  })
  async toggleUpvote(@Param('id') id: string, @GetUser('id') userId: number) {
    return this.startupService.toggleUpvote(parseInt(id, 10), userId);
  }

  @Post(':id/comment')
  @Roles('entrepreneur', 'investor', 'engager')
  @ApiOperation({ summary: 'Comment on a startup' })
  @ApiParam({ name: 'id', description: 'The ID of the startup' })
  @ApiBody({ type: String, description: 'The comment text' })
  @ApiCreatedResponse({ description: 'Comment added successfully.' })
  @ApiNotFoundResponse({ description: 'Startup not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden. User must have the appropriate role.',
  })
  async commentOnStartup(
    @Param('id') id: string,
    @Body('comment') comment: string,
    @GetUser('id') userId: number,
  ) {
    return this.startupService.commentOnStartup(
      parseInt(id, 10),
      comment,
      userId,
    );
  }

  @Post(':id/comment/:commentId/reply')
  @Roles('entrepreneur', 'investor', 'engager')
  @ApiOperation({ summary: 'Reply to a comment on a startup' })
  @ApiParam({ name: 'id', description: 'The ID of the startup' })
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment to reply to',
  })
  @ApiBody({ type: String, description: 'The reply text' })
  @ApiCreatedResponse({ description: 'Reply added successfully.' })
  @ApiNotFoundResponse({ description: 'Startup or comment not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden. User must have the appropriate role.',
  })
  async replyToComment(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @Body('reply') reply: string,
    @GetUser('id') userId: number,
  ) {
    return this.startupService.replyToComment(
      parseInt(id, 10),
      parseInt(commentId, 10),
      reply,
      userId,
    );
  }
}
