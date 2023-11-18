import { IsLatitude, IsLongitude, IsNotEmpty, IsOptional } from "class-validator";
import { type Prisma } from "@prisma/client";
export class CreatePostDTO {
    @IsNotEmpty()
    content: string

    @IsNotEmpty()
    user: Prisma.UserCreateNestedOneWithoutPostInput

    @IsNotEmpty()
    service: Prisma.ServiceCreateNestedOneWithoutPostInput

    @IsLongitude()
    @IsOptional()
    long?: number

    @IsLatitude()
    @IsOptional()
    lat?: number

    @IsOptional()
    address?: string
}
