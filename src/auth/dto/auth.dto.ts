//DTO(Data Transfar Object)クライアントからサーバに送られてくるデータのこと
//ここではユーザ認証時にクライアントから送られてくるデータの型を指定

import { IsEmail, IsNotEmpty, Length } from "class-validator";


export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @Length(8, 64)
    @IsNotEmpty()
    password: string; 
}