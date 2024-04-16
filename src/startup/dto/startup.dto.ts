import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateStartupDto {
  @IsString()
  pitchTitle: string;

  @IsOptional()
  @IsString()
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
