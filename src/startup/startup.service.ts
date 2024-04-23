import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStartupDto } from './dto';
import { UpdateStartupDto } from './dto/updateStartup.dto';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { DealDetails, PitchDeal, Team } from '@prisma/client';

@Injectable()
export class StartupService {
  constructor(private prisma: PrismaService) {}

  async createStartup(createStartupDto: CreateStartupDto, userId: number) {
    const {
      pitchTitle,
      website,
      location,
      mobileNumber,
      industry1,
      industry2,
      stage,
      idealInvestorRole,
      previousRoundAmount,
      totalRaisingAmount,
      raisedAmount,
      minimumInvestment,
      taxRelief,
    } = createStartupDto;

    if (!userId) {
      throw new Error('userId is undefined');
    }

    const startup = await this.prisma.startup.create({
      data: {
        user: { connect: { id: userId } }, // Connect the startup with the user using the userId
        pitch_title: pitchTitle,
        website,
        location,
        mobile_number: mobileNumber,
        industry_1: industry1 ? { connect: { id: industry1 } } : undefined,
        industry_2: industry2 ? { connect: { id: industry2 } } : undefined,
        stage: stage ? { connect: { id: stage } } : undefined,
        ideal_investor_role: idealInvestorRole
          ? { connect: { id: idealInvestorRole } }
          : undefined,
        previous_round_amount: previousRoundAmount,
        total_raising_amount: totalRaisingAmount,
        raised_amount: raisedAmount,
        minimum_investment: minimumInvestment,
        tax_relief: taxRelief ? { connect: { id: taxRelief } } : undefined,
      },
    });

    return {
      msg: 'Startup created successfully',
      startup_id: startup.id,
      startup_name: startup.pitch_title,
    };
  }

  async getMyStartups(userId: number) {
    const startups = await this.prisma.startup.findMany({
      where: { user_id: userId },
    });
    return startups;
  }

  async getStartupById(id: number) {
    const startup = await this.prisma.startup.findUnique({
      where: { id },
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
        comments: {
          include: {
            user: true, // Include user details for each comment
          },
        },
        upvotes: {
          include: {
            user: true, // Include user details for each upvote
          },
        },
        mlRecommendations: true,
      },
    });

    if (!startup) {
      throw new NotFoundException('Startup not found');
    }

    return startup;
  }

  async updateStartup(id: number, dto: UpdateStartupDto, userId: number) {
    const startup = await this.prisma.startup.findUnique({
      where: { id },
    });

    if (!startup) {
      throw new NotFoundException('Startup not found');
    }

    // Check if the current user is the owner of the startup
    if (startup.user_id !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this startup',
      );
    }

    // Update the startup using Prisma and the provided DTO
    const updatedStartup = await this.prisma.startup.update({
      where: { id },
      data: {
        pitch_title: dto.pitchTitle,
        website: dto.website,
        location: dto.location,
        mobile_number: dto.mobileNumber,
        industry_1: dto.industry1
          ? { connect: { id: dto.industry1 } }
          : undefined,
        industry_2: dto.industry2
          ? { connect: { id: dto.industry2 } }
          : undefined,
        stage: dto.stage ? { connect: { id: dto.stage } } : undefined,
        ideal_investor_role: dto.idealInvestorRole
          ? { connect: { id: dto.idealInvestorRole } }
          : undefined,
        previous_round_amount: dto.previousRoundAmount,
        total_raising_amount: dto.totalRaisingAmount,
        raised_amount: dto.raisedAmount,
        minimum_investment: dto.minimumInvestment,
        tax_relief: dto.taxRelief
          ? { connect: { id: dto.taxRelief } }
          : undefined,
      },
    });

    return updatedStartup;
  }

  async deleteStartup(id: number, userId: number) {
    const startup = await this.prisma.startup.findUnique({
      where: { id },
    });

    if (!startup) {
      throw new NotFoundException('Startup not found');
    }

    // Check if the current user is the owner of the startup
    if (startup.user_id !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this startup',
      );
    }

    await this.prisma.startup.delete({
      where: { id },
    });

    return { message: 'Startup deleted successfully' };
  }

  async getAllStartups() {
    const startups = await this.prisma.startup.findMany();
    return startups;
  }

  async showInterest(userId: number, startupId: number) {
    try {
      const interest = await this.prisma.interest.create({
        data: {
          userId,
          startupId,
        },
      });

      return interest;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        console.error('Foreign key constraint violation:', error);
        return {
          error: 'Invalid startup ID. The specified startup does not exist.',
        };
      } else if (
        error instanceof PrismaClientValidationError &&
        error.message.includes('Expected Int, provided String')
      ) {
        console.error('Invalid input type for startupId. Expected a number.');
        return {
          error: 'Invalid startup ID. Please provide a valid numerical ID.',
        };
      } else {
        console.error('An unexpected error occurred:', error);
        return {
          error: 'Failed to register interest. Please try again later.',
        };
      }
    }
  }

  async updateTeamMembers(
    startupId: number,
    teamMembers: Team[],
    userId: number,
  ) {
    const startup = await this.prisma.startup.findUnique({
      where: { id: startupId },
    });

    if (!startup) {
      throw new NotFoundException('Startup not found');
    }

    // Check if the current user is the owner of the startup
    if (startup.user_id !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this startup',
      );
    }

    // Delete existing team members
    await this.prisma.team.deleteMany({
      where: { startup_id: startupId },
    });

    // Create new team members
    const createdTeamMembers = await Promise.all(
      teamMembers.map((teamMember) =>
        this.prisma.team.create({
          data: {
            startup_id: startupId,
            team_member_name: teamMember.team_member_name,
            linkedin_profile: teamMember.linkedin_profile,
            position: teamMember.position,
            bio: teamMember.bio,
          },
        }),
      ),
    );

    return createdTeamMembers;
  }

  async updateDealDetails(
    startupId: number,
    dealDetails: DealDetails,
    userId: number,
  ) {
    const startup = await this.prisma.startup.findUnique({
      where: { id: startupId },
    });

    if (!startup) {
      throw new NotFoundException('Startup not found');
    }

    // Check if the current user is the owner of the startup
    if (startup.user_id !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this startup',
      );
    }

    // Update the deal details
    const updatedDealDetails = await this.prisma.dealDetails.upsert({
      where: { startup_id: startupId },
      create: {
        startup_id: startupId,
        deal_type: dealDetails.deal_type,
        deal_description: dealDetails.deal_description,
      },
      update: {
        deal_type: dealDetails.deal_type,
        deal_description: dealDetails.deal_description,
      },
    });

    return updatedDealDetails;
  }

  async updatePitchDeal(
    startupId: number,
    pitchDeal: PitchDeal,
    userId: number,
  ) {
    const startup = await this.prisma.startup.findUnique({
      where: { id: startupId },
    });

    if (!startup) {
      throw new NotFoundException('Startup not found');
    }

    // Check if the current user is the owner of the startup
    if (startup.user_id !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this startup',
      );
    }

    // Update the pitch deal
    const updatedPitchDeal = await this.prisma.pitchDeal.upsert({
      where: { startup_id: startupId },
      create: {
        startup_id: startupId,
        short_summary: pitchDeal.short_summary,
        business_description: pitchDeal.business_description,
        market_description: pitchDeal.market_description,
        progress_proof: pitchDeal.progress_proof,
        objectives_future: pitchDeal.objectives_future,
        highlights: pitchDeal.highlights,
      },
      update: {
        short_summary: pitchDeal.short_summary,
        business_description: pitchDeal.business_description,
        market_description: pitchDeal.market_description,
        progress_proof: pitchDeal.progress_proof,
        objectives_future: pitchDeal.objectives_future,
        highlights: pitchDeal.highlights,
      },
    });

    return updatedPitchDeal;
  }

  async toggleUpvote(startupId: number, userId: number) {
    try {
      const existingUpvote = await this.prisma.upvote.findFirst({
        where: {
          user_id: userId,
          startup_id: startupId,
        },
      });

      if (existingUpvote) {
        // If the user has already upvoted, remove the upvote
        await this.prisma.upvote.delete({
          where: {
            id: existingUpvote.id,
          },
        });
        return { message: 'Upvote removed' };
      } else {
        // If the user hasn't upvoted yet, create a new upvote
        const upvote = await this.prisma.upvote.create({
          data: {
            user_id: userId,
            startup_id: startupId,
          },
        });
        return { message: 'Upvote added' };
      }
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        console.error('Foreign key constraint violation:', error);
        return {
          error: 'Invalid startup ID. The specified startup does not exist.',
        };
      } else if (
        error instanceof PrismaClientValidationError &&
        error.message.includes('Expected Int, provided String')
      ) {
        console.error('Invalid input type for startupId. Expected a number.');
        return {
          error: 'Invalid startup ID. Please provide a valid numerical ID.',
        };
      } else {
        console.error('An unexpected error occurred:', error);
        return {
          error: 'Failed to update upvote status. Please try again later.',
        };
      }
    }
  }

  async commentOnStartup(startupId: number, comment: string, userId: number) {
    try {
      const newComment = await this.prisma.comment.create({
        data: {
          user_id: userId,
          startup_id: startupId,
          comment: comment,
        },
      });

      return newComment;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        console.error('Foreign key constraint violation:', error);
        return {
          error: 'Invalid startup ID. The specified startup does not exist.',
        };
      } else if (
        error instanceof PrismaClientValidationError &&
        error.message.includes('Expected Int, provided String')
      ) {
        console.error('Invalid input type for startupId. Expected a number.');
        return {
          error: 'Invalid startup ID. Please provide a valid numerical ID.',
        };
      } else {
        console.error('An unexpected error occurred:', error);
        return {
          error:
            'Failed to add comment to the startup. Please try again later.',
        };
      }
    }
  }

  async replyToComment(
    startupId: number,
    commentId: number,
    reply: string,
    userId: number,
  ) {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: { id: commentId },
      });

      if (!comment) {
        throw new NotFoundException('Comment not found');
      }

      const newReply = await this.prisma.comment.create({
        data: {
          user: { connect: { id: userId } },
          startup: { connect: { id: startupId } },
          comment: reply,
          parent: { connect: { id: commentId } },
        },
        include: {
          parent: true,
          replies: true,
        },
      });

      return newReply;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        console.error('Foreign key constraint violation:', error);
        return {
          error:
            'Invalid startup ID or comment ID. The specified entities do not exist.',
        };
      } else if (
        error instanceof PrismaClientValidationError &&
        error.message.includes('Expected Int, provided String')
      ) {
        console.error(
          'Invalid input type for startupId or commentId. Expected a number.',
        );
        return {
          error:
            'Invalid startup ID or comment ID. Please provide valid numerical IDs.',
        };
      } else {
        console.error('An unexpected error occurred:', error);
        return {
          error: 'Failed to add reply to the comment. Please try again later.',
        };
      }
    }
  }
}
