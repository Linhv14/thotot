import { IsEmail, IsString, IsNotEmpty, IsPhoneNumber, IsNumber, IsBoolean, IsOptional } from "class-validator"
import { gender } from '../types/user.type';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @IsNotEmpty()
  @IsString()
  email: string;
  
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginDTO {
  @IsNotEmpty() 
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty() 
  password: string;
}

export class CreateUserProfileDTO {
  @IsNotEmpty()
  name: string
  @IsNotEmpty()
  password: string
  @IsNotEmpty()
  email: string
  @IsNotEmpty()
  gender: gender
}