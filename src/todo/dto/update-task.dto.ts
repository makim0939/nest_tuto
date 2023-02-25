//タスクを更新する時にクライアントから送られてくるデータの型を定義

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsOptional()
  discription: string;
}
