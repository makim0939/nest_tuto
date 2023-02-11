
//AuthGuard("jwt")をカスタマイズする

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService,
      ){
        super(//親クラスのコンストラクタ
            {
                jwtFromRequest: ExtractJwt.fromExtractors(
                    [
                        (req) => {
                            let jwt = null;
                            if(req && req.cookies) {
                                jwt = req.cookies['access_token'];
                            }
                            return jwt;
                        }, 
                    ]   
                ), 
                ignoreExpiration: false,//jwtの有効期限が切れたら無効になるように
                secretOrKey: config.get('JWT_SEQRET')
            }
        )
    }
    //ここいつ通るんだっけ
    async validate(payload: {sub: number, email: string}) {
        const userInfo = {
            where: {
                id: payload.sub,
            },
        }
        const user = await this.prisma.user.findUnique(userInfo)
        delete user.password_hash;
        return user;//←これを自動的にリクエストに含めてくれる機能があるらしい（Nestには)
    }
} 