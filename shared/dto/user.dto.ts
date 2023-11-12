import { IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CraeteProfileDTO {
    @IsOptional()
    ID: number

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    phoneNumber: string

    @IsNumber()
    @IsOptional()
    age: number

    @IsNotEmpty()
    defaultAddress: string
}

export class ChangeAvatarDTO {
    @IsNotEmpty()
    @IsNumber()
    ID: number

    @IsNotEmpty()
    @IsString()
    avatar: string
}