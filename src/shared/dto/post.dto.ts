import { IsLatitude, IsLongitude, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePostDTO {
    @IsNumber()
    @IsOptional()
    userID: number

    @IsNumber()
    @IsOptional()
    serviceID: number

    @IsString()
    content: string

    @IsOptional()
    @IsString()
    address: string

    @IsLongitude()
    @IsOptional()
    long: number

    @IsLatitude()
    @IsOptional()
    lat: number
}