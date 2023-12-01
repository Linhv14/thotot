import { IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreatePostDTO {
    @IsNotEmpty()
    content: string

    @IsOptional()
    user?: {
        connect: {
            ID: number
        }
    }

    @IsNotEmpty()
    service: {
        connect: {
            ID: number
        }
    }

    @IsLongitude()
    @IsOptional()
    long?: number

    @IsLatitude()
    @IsOptional()
    lat?: number

    @IsOptional()
    address?: string
}
