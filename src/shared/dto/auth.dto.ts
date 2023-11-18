import { IsEmail, IsString, IsNotEmpty, IsOptional, IsNumber, IsStrongPassword } from "class-validator"

export class LoginDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  
  @IsNotEmpty()
  password: string;
}

export class RegisterDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  
  @IsNotEmpty()
  @IsStrongPassword()
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
  @IsStrongPassword()
  newPassword: string
}