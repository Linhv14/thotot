import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProfileDTO {
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
    avatar: string
}

export interface ORDER {
    DESC: 'desc'
    ASC: 'asc'
}

export class OptionsDTO {
    @IsOptional()
    orderBy?: {}
    @IsOptional()
    @IsNumber()
    take?: number
}