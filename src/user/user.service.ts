import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
    ){}

    async updateUser(
        userId: number, 
        dto: UpdateUserDto,
    ):Promise <Omit<User, 'password_hash'>> {//?::Omitってなにー
        const user = await this.prisma.user.update(
            {
                where: {
                    id: userId
                },
                data: {
                    ...dto,//?::何これ
                },
            }
        );
        delete user.password_hash;
        return user;
    }
}
