import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import { PrismaModule } from './prisma/prisma.module';
import { TodoController } from './todo/todo.controller';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    //forRoot({isGlobal: true})をつけると他のところでimportsに追加せずに使えるっぽい
    ConfigModule.forRoot({isGlobal: true}),
    AuthModule, 
    UserModule, 
    TodoModule,
    PrismaModule,
  ],
  controllers: [AppController, TodoController],
  providers: [AppService],
})
export class AppModule {}
