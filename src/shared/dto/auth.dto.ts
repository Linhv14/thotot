import { IsEmail, IsString, IsNotEmpty, IsOptional, IsNumber } from "class-validator"

export class AuthDTO {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class ChangePasswordDTO {
  @IsOptional()
  @IsNumber()
  ID: number

  @IsNotEmpty()
  @IsString()
  oldPassword: string

  @IsNotEmpty()
  @IsString()
  newPassword: string
}