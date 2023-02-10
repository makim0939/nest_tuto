import { IsEmail, IsNotEmpty, Length } from "class-validator";


export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @Length(8, 64)
    @IsNotEmpty()
    password: string; 
}