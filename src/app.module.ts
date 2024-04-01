import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { AppUpdate } from './app.update';
import { AppService } from './app.service';
import * as LocalSession from 'telegraf-session-local';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TaskEntity } from './task.entity';
import { TG_TOKEN } from './config';

const sessions = new LocalSession({ database: 'session_db.json' });
@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [sessions.middleware()],
      token: TG_TOKEN,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'todo-app-tg-bot',
      username: 'postgres',
      password: 'cjcbcrf84',
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      migrations: [join(__dirname, '**', '*migrations.{ts, js}')],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([TaskEntity]),
  ],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
