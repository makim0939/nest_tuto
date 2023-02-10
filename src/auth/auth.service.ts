import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bycript from 'bcrypt'
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { Jwt, Msg } from './interface/auth.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService
    ){}

    //?::asyncってなんだ
    async signUP(dto: AuthDto) {
        //?::awaitってなんだ
        const hashed = await bycript.hash(dto.password, 12);//ハッシュを計算するのに2の12乗回の演算が必要
        
        try{
            //prisma.model.メソッドでCRUD操作ができる。
            //createの引数には{data:[{1つ目}, {2つ目}, ...], }辞書型の中にデータの辞書型。複数のレコードも作成できる
            await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password_hash: hashed,
                },
            });
            return "ok"
        }
        catch (error) {

        }
    }
}
