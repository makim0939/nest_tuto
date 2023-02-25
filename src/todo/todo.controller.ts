import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Task } from '@prisma/client';
import { Request } from 'express';
import { CreateTaskDto } from './dto/crteate-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TodoService } from './todo.service';

@UseGuards(AuthGuard('jwt'))
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getTasks(@Req() req: Request): Promise<Task[]> {
    //?::なんでrequestにuserがはいってる//←作成したJwtStrategy.validate()の返り値が自動的にRequestに含まれるNestの仕様
    return this.todoService.getTasks(req.user.id);
  }

  @Get(':id') //←GetメソッドでURLに含まれるパラメータ//Getで　http://localhost:3005/todo/1 みたいにアクセス
  getTaskById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) taskId: number, //URLに含まれるパラメータ
  ): Promise<Task> {
    return this.todoService.getTaskById(req.user.id, taskId);
  }

  @Post()
  createTask(@Req() req: Request, @Body() dto: CreateTaskDto): Promise<Task> {
    return this.todoService.createTask(req.user.id, dto);
  }

  @Patch(':id')
  updaTaskById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) taskId: number,
    @Body() dto: UpdateTaskDto,
  ): Promise<Task> {
    return this.todoService.updateTaskById(req.user.id, taskId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT) //成功した場合のステータスをカスタイズできる
  @Delete(':id')
  deleteTask(
    @Req() req: Request,
    @Param('id', ParseIntPipe) taskId: number,
  ): Promise<void> {
    return this.todoService.deleteTaskById(req.user.id, taskId);
  }
}
