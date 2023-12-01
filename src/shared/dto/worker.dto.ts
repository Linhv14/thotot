import { IsBoolean, IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class UpdateWorkingModeDTO {
    @IsOptional()
    @IsNumber()
    ID: number

    @IsNotEmpty()
    @IsBoolean()
    workingMode: boolean

    @IsLongitude()
    @IsNotEmpty()
    long: number

    @IsLatitude()
    @IsNotEmpty()
    lat: number
}