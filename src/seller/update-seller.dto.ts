import { IsEmail, IsOptional, MinLength, Matches, IsString } from "class-validator";

export class UpdateSellerDto{
    @IsOptional()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    password?: string;

    @IsOptional()
    phone?: string;

    @IsOptional()
    nid?: string;

    @IsOptional()
    file?: string;

} 