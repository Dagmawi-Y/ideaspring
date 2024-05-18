import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  Investor,
  Startup,
  Industry,
  Stage,
  InvestedLocation,
  InvestedStage,
  InvestedIndustry,
  InvestorInterests,
  InvestorType,
} from '@prisma/client';

@Injectable()
export class MatchService {
  private readonly logger = new Logger(MatchService.name);

  constructor(private prisma: PrismaService) {}

  async getRecommendedStartups(investorId: number, limit: number) {
    const investor = await this.prisma.investor.findUnique({
      where: { id: investorId },
      include: {
        interested_locations: true,
        interested_stages: true,
        interested_industries: true,
        investorInterests: true,
        InvestorType: true,
      },
    });

    if (!investor) {
      return [];
    }

    this.logger.log(`Investor preferences: ${JSON.stringify(investor)}`);

    const startups = await this.prisma.startup.findMany({
      include: {
        industry_1: true,
        industry_2: true,
        stage: true,
      },
    });

    const matchedStartups = startups.filter((startup) =>
      this.matchStartupWithInvestor(startup, investor),
    );

    this.logger.log(`Matched startups: ${matchedStartups.length}`);

    const recommendedStartups = matchedStartups
      .map((startup) => ({
        startup,
        score: this.scoreStartup(startup, investor),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ startup }) => startup);

    return recommendedStartups;
  }

  private matchStartupWithInvestor(
    startup: Startup & {
      industry_1: Industry;
      industry_2: Industry;
      stage: Stage;
    },
    investor: Investor & {
      interested_locations: InvestedLocation[];
      interested_stages: InvestedStage[];
      interested_industries: InvestedIndustry[];
      investorInterests: InvestorInterests;
      InvestorType: InvestorType;
    },
  ): boolean {
    const matchesIndustry =
      investor.interested_industries.some(
        (industry) =>
          industry.industry_name === startup.industry_1?.industry_name ||
          industry.industry_name === startup.industry_2?.industry_name,
      ) || false;

    const matchesStage = investor.interested_stages.some(
      (stage) => stage.stage_name === startup.stage?.stage_name,
    );

    const matchesLocation = investor.interested_locations.some(
      (location) => location.location_name === startup.location,
    );

    const matchesFundingCriteria =
      investor.InvestorType.name === 'Angel Investor' ||
      investor.investorInterests.investment_criteria.includes('Series A') ||
      investor.investorInterests.investment_criteria.includes('Series B');

    return (
      matchesIndustry ||
      matchesStage ||
      matchesLocation ||
      matchesFundingCriteria
    );
  }

  private scoreStartup(
    startup: Startup & {
      industry_1: Industry;
      industry_2: Industry;
      stage: Stage;
    },
    investor: Investor & {
      interested_industries: InvestedIndustry[];
      interested_stages: InvestedStage[];
      interested_locations: InvestedLocation[];
      investorInterests: InvestorInterests;
      InvestorType: InvestorType;
    },
  ): number {
    let score = 0;

    // Industry match
    if (
      investor.interested_industries.some(
        (industry) =>
          industry.industry_name === startup.industry_1?.industry_name,
      )
    ) {
      score += 0.4; // Higher weight for primary industry match
    }
    if (
      investor.interested_industries.some(
        (industry) =>
          industry.industry_name === startup.industry_2?.industry_name,
      )
    ) {
      score += 0.2; // Lower weight for secondary industry match
    }

    // Stage match
    if (
      investor.interested_stages.some(
        (stage) => stage.stage_name === startup.stage?.stage_name,
      )
    ) {
      score += 0.3; // Moderate weight for stage match
    }

    // Location match
    if (
      investor.interested_locations.some(
        (location) => location.location_name === startup.location,
      )
    ) {
      score += 0.1; // Lower weight for location match
    }

    // Funding requirement match
    if (
      investor.InvestorType.name === 'Angel Investor' ||
      investor.investorInterests.investment_criteria.includes('Series A') ||
      investor.investorInterests.investment_criteria.includes('Series B')
    ) {
      score += 0.2; // Moderate weight for funding requirement match
    }

    this.logger.log(`Score for startup ${startup.id}: ${score}`);

    return score;
  }
}
