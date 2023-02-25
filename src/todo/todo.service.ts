import { ForbiddenException, Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/crteate-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  //特定のユーザのタスクを全て取得メソッド
  getTasks(userId: number): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        userId, //?::id:userIdじゃないのはなんでだろう
      },
      orderBy: {
        createdAt: 'desc', //createdAtの降順
      },
    });
  }
  //タスクを一つ取得メソッド
  getTaskById(userId: number, taskId: number): Promise<Task> {
    return this.prisma.task.findFirst({
      where: {
        userId,
        id: taskId,
      },
    });
  }
  //新規タスク作成メソッド
  async createTask(userId: number, dto: CreateTaskDto): Promise<Task> {
    const task = await this.prisma.task.create({
      data: {
        userId,
        ...dto, //title:"タイトル" , description:"説明"
      },
    });
    return task;
  }

  //タスク更新メソッド
  async updateTaskById(
    userId: number,
    taskId: number,
    dto: UpdateTaskDto,
  ): Promise<Task> {
    //指定されたタスクがあるかを確認
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });
    if (!task || task.userId != userId) {
      //なかったり、userIdが一致しなかったらエラーを投げる
      throw new ForbiddenException('No premision to update');
    }
    //問題なければ更新
    return this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteTaskById(userId: number, taskId: number): Promise<void> {
    //指定されたタスクがあるかを確認
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task || task.userId != userId) {
      //タスクが見つからなかったり、userIdが一致しなかったら、ForbiddenExceptionを投げる
      throw new ForbiddenException('No permision to delete');
    }
    await this.prisma.task.delete({
      where: {
        id: taskId,
      },
    });
  }
}
