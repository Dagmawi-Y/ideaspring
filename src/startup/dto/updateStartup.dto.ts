import { IsOptional, IsString, IsNumber, IsUrl } from 'class-validator';

export class UpdateStartupDto {
  @IsOptional()
  @IsString()
  pitchTitle?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  mobileNumber?: string;

  @IsOptional()
  @IsNumber()
  industry1?: number;

  @IsOptional()
  @IsNumber()
  industry2?: number;

  @IsOptional()
  @IsNumber()
  stage?: number;

  @IsOptional()
  @IsNumber()
  idealInvestorRole?: number;

  @IsOptional()
  @IsNumber()
  previousRoundAmount?: number;

  @IsOptional()
  @IsNumber()
  totalRaisingAmount?: number;

  @IsOptional()
  @IsNumber()
  raisedAmount?: number;

  @IsOptional()
  @IsNumber()
  minimumInvestment?: number;

  @IsOptional()
  @IsNumber()
  taxRelief?: number;
}
