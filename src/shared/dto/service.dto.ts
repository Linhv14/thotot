import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateServiceDTO {
    @IsNotEmpty()
    name: string
}

export class UpdateServiceDTO {
    @IsNumber()
    @IsNotEmpty()
    ID: number

    @IsNotEmpty()
    name: string
}
