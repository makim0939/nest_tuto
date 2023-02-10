//認証関係のルーティング

import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res,} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Msg } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService:AuthService,
    ){}

    @Post('signup')
    signup(@Body() dto: AuthDto):Promise<Msg> {//?::@Bodyがよくわからん
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
            jwt.accessToken,
            {
                httpOnly: true,
                secure: false,//動作確認時はfalse
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
                secure: false,//動作確認時はfalse
                sameSite: 'none',
                path: '/',
            }
        );
        return {message: 'ok'};

        
    }
}

