import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStartupDto } from './dto';

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
}
