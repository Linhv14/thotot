import { IsLatLong, IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { gender, role } from '../types/user.type';

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

    @IsOptional()
    gender: gender
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
    @IsNumber()
    take?: number
    @IsOptional()
    @IsNumber()
    skip?: number
    @IsOptional()
    orderBy?: {}
}

export class DeleteUserDTO {
    @IsNotEmpty()
    @IsNumber()
    ID: number
}

export class ChangeRoleDTO {
    @IsNotEmpty()
    role: role
}

export class CoordinateDTO {
    @IsNotEmpty()
    @IsLongitude()
    long: number
    @IsNotEmpty()
    @IsLatitude()
    lat: number
}