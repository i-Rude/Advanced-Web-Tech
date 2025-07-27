import { IsEmail, isNotEmpty, IsNotEmpty, IsOptional, Matches, MinLength } from "class-validator";

export class AddAdminDto{
    @IsNotEmpty()
    @MinLength(5)
    @Matches(/^[A-za-z\s]+$/)
    name : string;

    @IsNotEmpty()
    @IsEmail()
    @Matches(/^[\w-.]+@aiub\.edu$/ , {message: "Email format must contain @aiub.edu"},)
    email: string;

    @IsNotEmpty({ message: 'NID number is required' })
    @Matches(/^\d{10}$/, {
    message: 'Bangladeshi NID must be exactly 10 digits',
    })
    nid: string;
    
    @IsOptional()
    fileName:string;
}