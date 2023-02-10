import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {//PrismaClientを継承
    constructor(private readonly config: ConfigService,){
        super({
            datasources:{
                db:{
                    url:config.get("DATABASE_URL"),
                },
            }
        })
    }
}
