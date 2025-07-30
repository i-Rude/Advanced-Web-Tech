import { IsEmail, isNotEmpty, IsNotEmpty, IsOptional, Matches, MinLength } from "class-validator";

export class AddCustomerDto{
    @IsNotEmpty()
    @MinLength(5)
    @Matches(/^[A-za-z\s]+$/, {message: "Name must contain only letters and spaces"})
    name : string;

    @IsNotEmpty()
    @IsEmail()
    @Matches(/^[\w-.]+@aiub\.edu$/ , {message: "Email format must contain @aiub.edu"},)
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    @Matches(/^(?=.*[A-Z]).*$/, { message: 'Password must contain at least one uppercase letter' })
    password: string;

    @IsNotEmpty()
    @Matches(/^(male|female)$/i, { message: 'Gender must be either male or female' })
    gender: string;

    @IsNotEmpty()
    @Matches(/^\d+$/, { message: 'Invalid phone number' })
    phone: string;
    
    @IsOptional()
    fileName:string;
}