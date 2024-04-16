import { IsEmail, IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  profile_image?: string;

  @IsOptional()
  @IsString()
  banner_image?: string;

  @IsOptional()
  @IsString()
  town?: string;

  @IsOptional()
  @IsNumber()
  city_id?: number;

  @IsOptional()
  @IsNumber()
  country_id?: number;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsString()
  mobile_number?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
