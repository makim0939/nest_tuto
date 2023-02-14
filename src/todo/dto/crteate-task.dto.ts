//クライアントから送られてくるタスク作成のデータ型を定義

import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {

    @IsString()
    @IsNotEmpty()
    title: string;
    
    @IsString()
    @IsOptional()//?::どういう効果があるのかな
    discription?: string;//?::変数名の後に?つけるのは何//←オプションプロパティ。CreateTaskDtoのインスタンスはこのフィールドを持っても持たなくても良い。
}