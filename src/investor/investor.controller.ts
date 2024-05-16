import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Put,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { InvestorService } from './investor.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { GetUser } from '../auth/decorator';
import * as dto from './dto/index';
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

@ApiTags('Investors')
@ApiBearerAuth() // Indicate that all endpoints require a Bearer token
@UseGuards(JwtGuard, RolesGuard)
@Controller('investors')
export class InvestorController {
  constructor(private investorService: InvestorService) {}

  @Get('shortlisted')
  @Roles('entrepreneur')
  @ApiOperation({ summary: 'Get shortlisted investors for an entrepreneur' })
  @ApiOkResponse({
    description: 'Shortlisted investors retrieved successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden. User must be an entrepreneur.',
  })
  getShortlistedInvestors(@GetUser('id') userId: number) {
    return this.investorService.getShortlistedInvestors(userId);
  }

  @Get(':id')
  @Roles('entrepreneur', 'investor')
  @ApiOperation({ summary: 'Get an investor by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the investor' })
  @ApiOkResponse({ description: 'Investor retrieved successfully.' })
  @ApiNotFoundResponse({ description: 'Investor not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden. User must be an entrepreneur or investor.',
  })
  getInvestorById(@Param('id', ParseIntPipe) id: number) {
    return this.investorService.getInvestorById(id);
  }

  @Roles('investor', 'entrepreneur')
  @Post(':id/shortlist')
  @Roles('entrepreneur')
  @ApiOperation({ summary: 'Shortlist an investor for an entrepreneur' })
  @ApiParam({ name: 'id', description: 'The ID of the investor to shortlist' })
  @ApiCreatedResponse({ description: 'Investor shortlisted successfully.' })
  @ApiNotFoundResponse({ description: 'Investor or entrepreneur not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden. User must be an entrepreneur.',
  })
  shortlistInvestor(
    @Param('id') investorId: string,
    @GetUser('id') userId: number,
  ) {
    return this.investorService.shortlistInvestor(
      parseInt(investorId, 10),
      userId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of all investors' })
  @ApiOkResponse({ description: 'Investors retrieved successfully.' })
  getInvestors() {
    return this.investorService.getInvestors();
  }

  @Put(':id/profile')
  @Roles('investor')
  @ApiOperation({ summary: 'Update an investor profile' })
  @ApiParam({ name: 'id', description: 'The ID of the investor' })
  @ApiOkResponse({ description: 'Investor profile updated successfully.' })
  @ApiBadRequestResponse({ description: 'Bad Request. Invalid input data.' })
  @ApiNotFoundResponse({ description: 'Investor not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden. User must be an investor.' })
  updateInvestorProfile(
    @Param('id', ParseIntPipe) investorId: number,
    @Body() investorProfileDto: dto.InvestorProfileDto,
  ) {
    return this.investorService.updateInvestorProfile(
      investorId,
      investorProfileDto,
    );
  }

  @Put(':id/company')
  @Roles('investor')
  @ApiOperation({ summary: 'Update an investor company profile' })
  @ApiParam({ name: 'id', description: 'The ID of the investor' })
  @ApiOkResponse({
    description: 'Investor company profile updated successfully.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request. Invalid input data.' })
  @ApiNotFoundResponse({ description: 'Investor not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden. User must be an investor.' })
  updateInvestorCompanyProfile(
    @Param('id', ParseIntPipe) investorId: number,
    @Body() investorCompanyProfileDto: dto.InvestorCompanyProfileDto,
  ) {
    return this.investorService.updateInvestorCompanyProfile(
      investorId,
      investorCompanyProfileDto,
    );
  }

  @Put(':id/interests')
  @Roles('investor')
  @ApiOperation({ summary: 'Update an investor interests' })
  @ApiParam({ name: 'id', description: 'The ID of the investor' })
  @ApiOkResponse({ description: 'Investor interests updated successfully.' })
  @ApiBadRequestResponse({ description: 'Bad Request. Invalid input data.' })
  @ApiNotFoundResponse({ description: 'Investor not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden. User must be an investor.' })
  updateInvestorInterests(
    @Param('id', ParseIntPipe) investorId: number,
    @Body() investorInterestsDto: dto.InvestorInterestsDto,
  ) {
    return this.investorService.updateInvestorInterests(
      investorId,
      investorInterestsDto,
    );
  }

  @Post(':id/invested-locations')
  @Roles('investor')
  @ApiOperation({ summary: 'Add a location to an investor invested locations' })
  @ApiParam({ name: 'id', description: 'The ID of the investor' })
  @ApiCreatedResponse({ description: 'Invested location added successfully.' })
  @ApiBadRequestResponse({ description: 'Bad Request. Invalid input data.' })
  @ApiNotFoundResponse({ description: 'Investor not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden. User must be an investor.' })
  addInvestedLocation(
    @Param('id', ParseIntPipe) investorId: number,
    @Body() investedLocationDto: dto.InvestedLocationDto,
  ) {
    return this.investorService.addInvestedLocation(
      investorId,
      investedLocationDto,
    );
  }

  @Post(':id/invested-stages')
  @Roles('investor')
  @ApiOperation({ summary: 'Add a stage to an investor invested stages' })
  @ApiParam({ name: 'id', description: 'The ID of the investor' })
  @ApiCreatedResponse({ description: 'Invested stage added successfully.' })
  @ApiBadRequestResponse({ description: 'Bad Request. Invalid input data.' })
  @ApiNotFoundResponse({ description: 'Investor not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden. User must be an investor.' })
  addInvestedStage(
    @Param('id', ParseIntPipe) investorId: number,
    @Body() investedStageDto: dto.InvestedStageDto,
  ) {
    return this.investorService.addInvestedStage(investorId, investedStageDto);
  }

  @Post(':id/invested-industries')
  @Roles('investor')
  @ApiOperation({
    summary: 'Add an industry to an investor invested industries',
  })
  @ApiParam({ name: 'id', description: 'The ID of the investor' })
  @ApiCreatedResponse({ description: 'Invested industry added successfully.' })
  @ApiBadRequestResponse({ description: 'Bad Request. Invalid input data.' })
  @ApiNotFoundResponse({ description: 'Investor not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden. User must be an investor.' })
  addInvestedIndustry(
    @Param('id', ParseIntPipe) investorId: number,
    @Body() investedIndustryDto: dto.InvestedIndustryDto,
  ) {
    return this.investorService.addInvestedIndustry(
      investorId,
      investedIndustryDto,
    );
  }

  @Post(':id/invested-countries')
  @Roles('investor')
  @ApiOperation({ summary: 'Add a country to an investor invested countries' })
  @ApiParam({ name: 'id', description: 'The ID of the investor' })
  @ApiCreatedResponse({ description: 'Invested country added successfully.' })
  @ApiBadRequestResponse({ description: 'Bad Request. Invalid input data.' })
  @ApiNotFoundResponse({ description: 'Investor not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden. User must be an investor.' })
  addInvestedCountry(
    @Param('id', ParseIntPipe) investorId: number,
    @Body() investedCountryDto: dto.InvestedCountryDto,
  ) {
    return this.investorService.addInvestedCountry(
      investorId,
      investedCountryDto,
    );
  }

  @Post(':id/languages')
  @Roles('investor')
  @ApiOperation({ summary: 'Add a language to an investor languages' })
  @ApiParam({ name: 'id', description: 'The ID of the investor' })
  @ApiCreatedResponse({ description: 'Language added successfully.' })
  @ApiBadRequestResponse({ description: 'Bad Request. Invalid input data.' })
  @ApiNotFoundResponse({ description: 'Investor not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden. User must be an investor.' })
  addLanguage(
    @Param('id', ParseIntPipe) investorId: number,
    @Body() languageDto: dto.LanguageDto,
  ) {
    return this.investorService.addLanguage(investorId, languageDto);
  }

  @Post(':id/keywords')
  @Roles('investor')
  @ApiOperation({ summary: 'Add a keyword to an investor keywords' })
  @ApiParam({ name: 'id', description: 'The ID of the investor' })
  @ApiCreatedResponse({ description: 'Keyword added successfully.' })
  @ApiBadRequestResponse({ description: 'Bad Request. Invalid input data.' })
  @ApiNotFoundResponse({ description: 'Investor not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden. User must be an investor.' })
  addKeyword(
    @Param('id', ParseIntPipe) investorId: number,
    @Body() keywordDto: dto.KeywordDto,
  ) {
    return this.investorService.addKeyword(investorId, keywordDto);
  }

  @Post(':id/invested-companies')
  @Roles('investor')
  @ApiOperation({ summary: 'Add a company to an investor invested companies' })
  @ApiParam({ name: 'id', description: 'The ID of the investor' })
  @ApiCreatedResponse({ description: 'Invested company added successfully.' })
  @ApiBadRequestResponse({ description: 'Bad Request. Invalid input data.' })
  @ApiNotFoundResponse({ description: 'Investor not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden. User must be an investor.' })
  addInvestorCompany(
    @Param('id', ParseIntPipe) investorId: number,
    @Body() investorCompanyDto: dto.InvestorCompanyDto,
  ) {
    return this.investorService.addInvestorCompany(
      investorId,
      investorCompanyDto,
    );
  }

  @Post(':id/investor-type')
  @Roles('investor')
  @ApiOperation({ summary: 'Associate an investor with an investor type' })
  @ApiParam({ name: 'id', description: 'The ID of the investor' })
  @ApiCreatedResponse({ description: 'Investor type associated successfully.' })
  @ApiBadRequestResponse({ description: 'Bad Request. Invalid input data.' })
  @ApiNotFoundResponse({ description: 'Investor or investor type not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User must be logged in.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden. User must be an investor.' })
  async addInvestorType(
    @Param('id', ParseIntPipe) investorId: number,
    @Body('investorTypeName') investorTypeName: string,
  ) {
    return this.investorService.addInvestorType(investorId, investorTypeName);
  }

}
