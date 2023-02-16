//認証関係のルーティング

import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res,} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Csrf, Msg } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService:AuthService,
    ){}

    @Get('csrf')
    getCsrfToken(@Req() req: Request): Csrf {
        return {csrfToken: req.csrfToken()};
    } 

    @Post('signup')
    //?::@Bodyがよくわからん//←POSTで送られたデータを受け取る変数を指定
    //?::Bodyにdtoを指定できるのなんで? 
    //←リクエストボディがValidation Pipeにわたったとき、class-transformerによって、JSオブジェクトからClassのインスタンスに変換されるから。
    signup(@Body() dto: AuthDto):Promise<Msg> {
        return this.authService.signup(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(
        @Body() dto: AuthDto,
        @Res({passthrough: true}) res: Response,
    ):Promise<Msg> {
        const jwt = await this.authService.login(dto);
        res.cookie(
            'access_token', 
            jwt.access_token,
            {
                httpOnly: true,
                secure: true,//動作確認時はfalse
                sameSite: 'none',
                path: '/',
            }
        );
        return {message: 'ok'};

        
    }

    @HttpCode(HttpStatus.OK)
    @Post('logout')
    async logout(
        @Body() dto: AuthDto,
        @Res({passthrough: true}) res: Response,
    ):Promise<Msg> {
        
        const jwt = await this.authService.login(dto);
        res.cookie(
            'access_token', 
            '',//←アクセストークンを空にすることでログアウト
            {
                httpOnly: true,
                secure: true,//動作確認時はfalse
                sameSite: 'none',
                path: '/',
            }
        );
        return {message: 'ok'};

        
    }
}

