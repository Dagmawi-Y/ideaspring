import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Investor, Prisma } from '@prisma/client';
import * as dto from './dto/index';

@Injectable()
export class InvestorService {
  constructor(private prisma: PrismaService) {}

  async getInvestors() {
    return this.prisma.investor.findMany({
      include: {
        investorProfile: true,
        investorCompanyProfile: true,
        investorInterests: true,
        interested_locations: true,
        interested_stages: true,
        interested_industries: true,
        interested_countries: true,
        spoken_languages: true,
      },
    });
  }

  async getInvestorById(id: number) {
    const investor = await this.prisma.investor.findUnique({
      where: { id },
      include: {
        InvestorType: true,
        investorProfile: true,
        investorCompanyProfile: true,
        investorInterests: true,
        interested_locations: true,
        interested_stages: true,
        interested_industries: true,
        interested_countries: true,
        spoken_languages: true,
      },
    });

    if (!investor) {
      throw new NotFoundException(`Investor with ID ${id} not found`);
    }

    return investor;
  }

  async shortlistInvestor(investorId: number, userId: number) {
    // Check if the investor exists
    const investor = await this.prisma.investor.findUnique({
      where: { id: investorId },
    });

    if (!investor) {
      throw new NotFoundException('Investor not found');
    }

    // Check if already shortlisted
    const existingShortlist = await this.prisma.shortlistedInvestor.findUnique({
      where: {
        user_id_investor_id: {
          user_id: userId,
          investor_id: investorId,
        },
      },
    });

    if (existingShortlist) {
      throw new BadRequestException('Investor already shortlisted');
    }

    // Create a new shortlist entry
    const shortlist = await this.prisma.shortlistedInvestor.create({
      data: {
        user_id: userId,
        investor_id: investorId,
      },
    });

    return { message: 'Investor shortlisted successfully', shortlist };
  }

  async getShortlistedInvestors(userId: number) {
    const shortlistedInvestors = await this.prisma.shortlistedInvestor.findMany(
      {
        where: { user_id: userId },
        include: {
          investor: {
            include: {
              investorProfile: true,
              interested_countries: true,
              // ... other relevant investor relations
            },
          },
        },
      },
    );

    return shortlistedInvestors.map((item) => item.investor);
  }

  async updateInvestorProfile(
    investorId: number,
    investorProfileDto: dto.InvestorProfileDto,
  ) {
    const investor = await this.prisma.investor.findUnique({
      where: { id: investorId },
    });

    if (!investor) {
      throw new NotFoundException(`Investor with ID ${investorId} not found`);
    }

    const updatedInvestorProfile = await this.prisma.investorProfile.update({
      where: { investor_id: investorId },
      data: investorProfileDto,
    });

    return updatedInvestorProfile;
  }

  async updateInvestorCompanyProfile(
    investorId: number,
    investorCompanyProfileDto: dto.InvestorCompanyProfileDto,
  ) {
    const investor = await this.prisma.investor.findUnique({
      where: { id: investorId },
    });

    if (!investor) {
      throw new NotFoundException(`Investor with ID ${investorId} not found`);
    }

    const updatedInvestorCompanyProfile =
      await this.prisma.investorCompanyProfile.update({
        where: { investor_id: investorId },
        data: investorCompanyProfileDto,
      });

    return updatedInvestorCompanyProfile;
  }

  async updateInvestorInterests(
    investorId: number,
    investorInterestsDto: dto.InvestorInterestsDto,
  ) {
    const investor = await this.prisma.investor.findUnique({
      where: { id: investorId },
    });

    if (!investor) {
      throw new NotFoundException(`Investor with ID ${investorId} not found`);
    }

    const updatedInvestorInterests = await this.prisma.investorInterests.update(
      {
        where: { investor_id: investorId },
        data: investorInterestsDto,
      },
    );

    return updatedInvestorInterests;
  }

  async addInvestedLocation(
    investorId: number,
    investedLocationDto: dto.InvestedLocationDto,
  ) {
    const investor = await this.prisma.investor.findUnique({
      where: { id: investorId },
    });

    if (!investor) {
      throw new NotFoundException(`Investor with ID ${investorId} not found`);
    }

    const newInvestedLocation = await this.prisma.investedLocation.create({
      data: {
        investor_id: investorId,
        location_name: investedLocationDto.location_name,
      },
    });

    return newInvestedLocation;
  }

  async addInvestedStage(
    investorId: number,
    investedStageDto: dto.InvestedStageDto,
  ) {
    const investor = await this.prisma.investor.findUnique({
      where: { id: investorId },
    });

    if (!investor) {
      throw new NotFoundException(`Investor with ID ${investorId} not found`);
    }

    const newInvestedStage = await this.prisma.investedStage.create({
      data: {
        ...investedStageDto,
        investor_id: investorId,
      },
    });

    return newInvestedStage;
  }

  async addInvestedIndustry(
    investorId: number,
    investedIndustryDto: dto.InvestedIndustryDto,
  ) {
    const investor = await this.prisma.investor.findUnique({
      where: { id: investorId },
    });

    if (!investor) {
      throw new NotFoundException(`Investor with ID ${investorId} not found`);
    }

    const newInvestedIndustry = await this.prisma.investedIndustry.create({
      data: {
        ...investedIndustryDto,
        investor_id: investorId,
      },
    });

    return newInvestedIndustry;
  }

  async addInvestedCountry(
    investorId: number,
    investedCountryDto: dto.InvestedCountryDto,
  ) {
    const investor = await this.prisma.investor.findUnique({
      where: { id: investorId },
    });

    if (!investor) {
      throw new NotFoundException(`Investor with ID ${investorId} not found`);
    }

    const newInvestedCountry = await this.prisma.investedCountry.create({
      data: {
        ...investedCountryDto,
        investor_id: investorId,
      },
    });

    return newInvestedCountry;
  }

  async addLanguage(investorId: number, languageDto: dto.LanguageDto) {
    const investor = await this.prisma.investor.findUnique({
      where: { id: investorId },
    });

    if (!investor) {
      throw new NotFoundException(`Investor with ID ${investorId} not found`);
    }

    const newLanguage = await this.prisma.language.create({
      data: {
        ...languageDto,
        investor_id: investorId,
      },
    });

    return newLanguage;
  }

  async addKeyword(investorId: number, keywordDto: dto.KeywordDto) {
    const investor = await this.prisma.investor.findUnique({
      where: { id: investorId },
    });

    if (!investor) {
      throw new NotFoundException(`Investor with ID ${investorId} not found`);
    }

    const newKeyword = await this.prisma.keyword.create({
      data: {
        ...keywordDto,
        investor_id: investorId,
      },
    });

    return newKeyword;
  }

  async addInvestorCompany(
    investorId: number,
    investorCompanyDto: dto.InvestorCompanyDto,
  ) {
    const investor = await this.prisma.investor.findUnique({
      where: { id: investorId },
    });

    if (!investor) {
      throw new NotFoundException(`Investor with ID ${investorId} not found`);
    }

    const newInvestorCompany = await this.prisma.investorCompany.create({
      data: {
        ...investorCompanyDto,
        investor_id: investorId,
      },
    });

    return newInvestorCompany;
  }

  async addInvestorType(investorId: number, investorTypeName: string) {
    const investor = await this.prisma.investor.findUnique({
      where: { id: investorId },
    });

    if (!investor) {
      throw new NotFoundException(`Investor with ID ${investorId} not found`);
    }

    const investorType = await this.prisma.investorType.findUnique({
      where: { name: investorTypeName },
    });

    if (!investorType) {
      throw new NotFoundException(
        `Investor type "${investorTypeName}" not found`,
      );
    }

    const updatedInvestor = await this.prisma.investor.update({
      where: { id: investorId },
      data: {
        InvestorType: {
          connect: {
            id: investorType.id,
          },
        },
      },
    });

    return updatedInvestor;
  }
}
