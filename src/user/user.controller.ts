

import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserService } from './user.service';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){}

    @Get()
    getLoginUser(@Req() req: Request): Omit<User, 'password_hash'> {//?::@Reqってなんだっけ/←リクエストを受け取る変数を指定してるのかな
        return req.user;//?::なんでreqにuserが？?//← Nestの機能。詳しくわわからん
    }

    @Patch()//?::Patchの仕様
    updateUser(
        @Req() req: Request,
        @Body() dto: UpdateUserDto,
    ): Promise<Omit<User, 'password_hash'>> {
        return this.userService.updateUser(req.user.id, dto);
    }

}

