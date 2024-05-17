import { IsNumber } from 'class-validator';

export class ShortlistInvestorDto {
  @IsNumber()
  investorId: number;

  @IsNumber()
  userId: number;
}
