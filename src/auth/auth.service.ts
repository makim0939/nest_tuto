//auth.controllerで呼び出される処理

import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bycript from 'bcrypt'
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { Jwt, Msg } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
    constructor(
        //使用するクラスをDIで注入
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService
    ){}

    //?::asyncってなんだ
    async signup(dto: AuthDto):Promise<Msg> {
        //?::awaitってなんだ//←bycript.hash(dto.password, 12)が終わるまでsignup内の下のこれより下の処理を実行しない。
        const hashed = await bycript.hash(dto.password, 12);//ハッシュを計算するのに2の12乗回の演算が必要
        
        try{
            //prisma.model.メソッドでCRUD操作ができる。
            //https:www.prisma.io/docs/reference/api-reference/prisma-client-reference#model-queries
            //createの引数には{data:[{1つ目}, {2つ目}, ...], }辞書型の中にデータの辞書型。複数のレコードも作成できる
            await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password_hash: hashed,
                },
            });
            return {message: 'ok'}
        }
        catch (error) {
            //?::instanceofってなんだ
            if(error instanceof PrismaClientKnownRequestError) {
                //ドキュメントにエラーコードと内容が書かれてる
                if (error.code == "P2002") {
                    throw new ForbiddenException("This email is already taken")
                } 
            }
            throw error;
        }
    }

    async login(dto: AuthDto):Promise<Jwt> {
        //emailからユーザを取得
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            },
        });
        //入力されたemailが見つからなかった場合
        if (!user) throw new ForbiddenException("Email or password incorrect")

        //見つかった場合は入力されたパスワードを確認
        const isValid = await bycript.compare(dto.password, user.password_hash)
        if (!isValid) throw new ForbiddenException("Email or password incorrect")

        //問題なければ
        //アクセストークンを返す。
        return this.generateJwt(user.id, user.email)
    }

    

    //jwt(json)を生成するメソッド//?::Promis<>って何
    async generateJwt(userId: number, email: string):Promise<Jwt> {
        const payload = {
            sub: userId,
            email,
        };
        const secret = this.config.get("JWT_SEQRET");
        const token = await this.jwt.signAsync(
            payload, 
            {
                expiresIn: "5m",//アクセストークンの有効期限
                secret: secret,
            }
            )
        
        return {access_token: token};
    }
}
