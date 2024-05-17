import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsIn,
  IsOptional,
  IsEnum,
} from 'class-validator';

enum UserRole {
  Engager = 'engager',
  Entrepreneur = 'entrepreneur',
  Investor = 'investor',
  Admin = 'admin',
}

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @IsOptional()
  investor_type?: string;
}
