import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtGuard } from '../auth/guard';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Search')
@ApiBearerAuth() // Indicate that the endpoint requires a Bearer token
@UseGuards(JwtGuard) // Ensure user is logged in
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('startups')
  @ApiOperation({ summary: 'Search for startups' })
  @ApiQuery({ name: 'query', description: 'The search query string' })
  @ApiOkResponse({ description: 'Matching startups retrieved successfully.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  async searchStartups(@Query('query') query: string) {
    return this.searchService.searchStartups(query);
  }
}
