import { IsEmail, IsOptional, MinLength, minLength } from "class-validator";

export class UpdateCustomerDto{
    @IsOptional()
    @MinLength(5)
    name?:string;

    @IsOptional()
    @IsEmail()
    email?:string;

    @IsOptional()
    password?:string;

    @IsOptional()
    gender?:string;

    @IsOptional()
    phone?:string;

    @IsOptional()
    file? : string;
}