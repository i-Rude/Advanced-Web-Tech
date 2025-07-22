import { IsEmail, IsOptional, MinLength, minLength } from "class-validator";

export class UpdateAdminDto{
    @IsOptional()
    @MinLength(5)
    name?:string;

    @IsOptional()
    @IsEmail()
    email?:string;
}