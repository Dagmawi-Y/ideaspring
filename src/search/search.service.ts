import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchStartups(query: string) {
    // Check if the query string is at least 3 characters
    if (query.length < 3) {
      return { error: 'Search query must be at least 3 characters' };
    }

    const startups = await this.prisma.startup.findMany({
      where: {
        OR: [
          { pitch_title: { contains: query } },
          { website: { contains: query } },
          { location: { contains: query } },

          {
            industry_1: {
              industry_name: { contains: query },
            },
          },
          {
            industry_2: {
              industry_name: { contains: query },
            },
          },
          {
            stage: {
              stage_name: { contains: query },
            },
          },
          {
            ideal_investor_role: {
              role_name: { contains: query },
            },
          },
          {
            tax_relief: {
              relief_name: { contains: query },
            },
          },
        ],
      },
      include: {
        industry_1: true,
        industry_2: true,
        stage: true,
        ideal_investor_role: true,
        tax_relief: true,
        pitch_deal: true,
        deal_details: true,
        team_members: true,
        images_videos: true,
        documents: true,
        // comments: {
        //   include: {
        //     user: true,
        //   },
        // },
        upvotes: {
          include: {
            user: true,
          },
        },
        // mlRecommendations: true,
        Interest: true,
      },
      orderBy: {
        _relevance: { fields: ['pitch_title'], sort: 'desc', search: query },
      },
    });

    if (startups.length === 0) {
      return { message: 'No matching entries found in the database' };
    }

    console.log({ startups });
    return startups;
  }
}
