import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //class-varidatorを有効にするために必要。//whitelist:true 作成したAuthDtoクラスに含まれないフィールドを受け取らない。
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000', 'https://todo-nextjs-pied.vercel.app'],
  });
  //ミドルウェアcookieParser()を実装。Cookieヘッダーを解析し、req.cookies[クッキー名]を追加する。
  //cookieParser : https://www.npmjs.com/package/cookie-parser
  app.use(cookieParser());
  //ミドルウェアcsurf()を実装
  //csurf : https://www.npmjs.com/package/csurf
  app.use(
    csurf({
      cookie: {
        httpOnly: true, //javascriptから読み込めない
        sameSite: 'none',
        secure: true, //デバッグ用にfaulse//cookieをHTTPSのみで使用するかどうか
      },
      value: (req: Request) => {
        //value: 検証のため呼び出されるリクエストからトークンを読み取る関数
        return req.header('csrf-token'); //ヘッダーの要素に csrf-token: トークン が正しく存在しないと、ログインできなくなる。
      },
    }),
  );
  await app.listen(process.env.PORT || 3005); //本番環境では環境変数にあるPORTを参照
}
bootstrap();
