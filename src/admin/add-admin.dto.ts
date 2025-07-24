import { IsEmail, isNotEmpty, IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class AddAdminDto{
    @IsNotEmpty()
    @MinLength(5)
    name : string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
    
    @IsOptional()
    fileName:string;
}