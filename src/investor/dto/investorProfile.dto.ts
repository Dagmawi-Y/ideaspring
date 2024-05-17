import { IsString, IsNumber, IsEmail } from 'class-validator';

export class InvestorProfileDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  profile_image?: string;

  @IsString()
  banner_image?: string;

  @IsString()
  town_city?: string;

  @IsString()
  country?: string;

  @IsString()
  phone_number?: string;

  @IsString()
  mobile_number?: string;

  @IsString()
  linkedin_profile?: string;

  @IsString()
  twitter_profile?: string;

  @IsString()
  facebook_profile?: string;

  @IsString()
  website?: string;

  @IsString()
  skype?: string;

  @IsString()
  about_me?: string;
}

export class InvestorCompanyProfileDto {
  @IsString()
  company?: string;

  @IsString()
  position?: string;

  @IsString()
  company_description?: string;

  @IsString()
  company_website?: string;
}

export class InvestorInterestsDto {
  @IsString()
  investment_criteria?: string;

  @IsString()
  areas_of_expertise?: string;

  @IsString()
  value_addition?: string;

  @IsNumber()
  number_of_investments?: number;
}

export class InvestedLocationDto {
  @IsString()
  location_name: string;
}

export class InvestedStageDto {
  @IsString()
  stage_name: string;
}

export class InvestedIndustryDto {
  @IsString()
  industry_name: string;
}

export class InvestedCountryDto {
  @IsString()
  country_name: string;
}

export class LanguageDto {
  @IsString()
  language_name: string;
}

export class KeywordDto {
  @IsString()
  keyword_name: string;
}

export class InvestorCompanyDto {
  @IsString()
  company_name: string;

  @IsNumber()
  invested_amount?: number;

  @IsNumber()
  industry_id?: number;

  @IsNumber()
  stage_id?: number;
}
