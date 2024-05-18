import { Controller, Get, Query, Param } from '@nestjs/common';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get(':investorId')
  async getRecommendedStartups(
    @Param('investorId') investorId: string,
    @Query('limit') limit = 10,
  ) {
    const recommendedStartups = await this.matchService.getRecommendedStartups(
      parseInt(investorId),
      limit,
    );
    return recommendedStartups;
  }
}
