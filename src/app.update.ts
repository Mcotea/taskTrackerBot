import {
  Ctx,
  Hears,
  InjectBot,
  Message,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { actionButtons, editButtons } from './app.buttons';
import { AppService } from './app.service';
import { showList } from './app.utils';
import { Context } from './context.interface';

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) {}
  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Привет!🐸');
    await ctx.reply('Что ты хочешь cделать?', actionButtons());
  }

  @Hears('➕Создать задачу')
  async createTask(ctx: Context) {
    ctx.session.type = 'create';
    await ctx.deleteMessage();
    await ctx.reply('Напиши название задачи: ');
  }
  @Hears('📋Список задач')
  async tasksList(ctx: Context) {
    const todos = await this.appService.getAll(ctx.chat.id);
    const botMessage = ctx.message.message_id - 1;
    const userMessage = ctx.message.message_id;
    await ctx.deleteMessages([botMessage, userMessage]);
    if (await this.appService.isEmpty(ctx.chat.id)) {
      await ctx.reply('Список задач пуст!', actionButtons());
    } else {
      await ctx.reply(showList(todos), actionButtons());
    }
  }

  @Hears('✅Завершить задачу')
  async doneTask(ctx: Context) {
    ctx.session.type = 'done';
    await ctx.deleteMessage();
    await ctx.reply('Напиши ID задачи: ');
  }

  @Hears('✏️Отредактировать задачу')
  async editTask(ctx: Context) {
    ctx.session.type = 'edit';
    await ctx.deleteMessage();
    await ctx.reply('Что ты хочешь cделать?', editButtons());
  }

  @Hears('📖Поменять название')
  async editTaskName(ctx: Context) {
    ctx.session.type = 'edit name';
    await ctx.deleteMessage();
    await ctx.replyWithHTML(
      'Напиши ID и новое название: \n\n' +
        'В формате - <b>ID. Новое название</b>',
      actionButtons(),
    );
  }

  @Hears('#️⃣Поменять категорию')
  async editTaskTag(ctx: Context) {
    ctx.session.type = 'edit tag';
    await ctx.deleteMessage();
    await ctx.replyWithHTML(
      'Напиши ID и новую категорию: \n\n' +
        'В формате - <b>ID. Новая категория</b>',
      actionButtons(),
    );
  }

  @Hears('⏳Поменять дедлайн')
  async editTaskDeadline(ctx: Context) {
    ctx.session.type = 'edit deadline';
    await ctx.deleteMessage();
    await ctx.replyWithHTML(
      'Напиши ID и новый дедлайн: \n\n' +
        'В формате - <b>ID. Новый дедлайн</b>',
      actionButtons(),
    );
  }

  @Hears('🔙Назад')
  async goToMainMenu(ctx: Context) {
    await ctx.reply('Что ты хочешь cделать?', actionButtons());
  }

  @Hears('🗑Удалить задачу')
  async removeTask(ctx: Context) {
    ctx.session.type = 'remove';
    await ctx.deleteMessage();
    await ctx.reply('Напиши ID задачи: ');
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
    if (!ctx.session.type) return;

    if (ctx.session.type === 'done') {
      const todos = await this.appService.doneTask(
        Number(message),
        ctx.chat.id,
      );

      if (!todos) {
        await ctx.deleteMessage(ctx.message.message_id - 1);
        await ctx.reply('Задачи с таким ID не найдено...🤨', actionButtons());
        return;
      }

      if (await this.appService.isEmpty(ctx.chat.id)) {
        await ctx.reply('Список задач пуст!', actionButtons());
      } else {
        await ctx.reply(showList(todos), actionButtons());
      }
    }

    if (ctx.session.type === 'create') {
      const todos = await this.appService.createTask(message, ctx.chat.id);
      if (await this.appService.isEmpty(ctx.chat.id)) {
        await ctx.reply('Список задач пуст!', actionButtons());
      } else {
        await ctx.reply(showList(todos), actionButtons());
      }
    }

    if (ctx.session.type === 'edit name') {
      const isValidFormat = /^\d+\..+/.test(message);
      const [taskId, taskName] = message.split('. ');
      if (isValidFormat && taskName) {
        const todos = await this.appService.editTaskName(
          Number(taskId),
          taskName,
          ctx.chat.id,
        );

        if (!todos) {
          await ctx.deleteMessage(ctx.message.message_id - 1);
          await ctx.reply('Задачи с таким ID не найдено...🤨', editButtons());
          return;
        }

        if (await this.appService.isEmpty(ctx.chat.id)) {
          await ctx.reply('Список задач пуст!', actionButtons());
        } else {
          await ctx.reply(showList(todos), actionButtons());
        }
      } else {
        await ctx.replyWithHTML(
          'Напиши ID и новое название: \n\n' +
            'В формате - <b>ID. Новое название</b>',
          editButtons(),
        );
        return;
      }
    }

    if (ctx.session.type === 'edit tag') {
      const isValidFormat = /^\d+\..+/.test(message);
      const [taskId, taskTag] = message.split('. ');
      if (isValidFormat && taskTag) {
        const todos = await this.appService.editTaskTag(
          Number(taskId),
          taskTag,
          ctx.chat.id,
        );

        if (!todos) {
          await ctx.deleteMessage(ctx.message.message_id - 1);
          await ctx.reply('Задачи с таким ID не найдено...🤨', editButtons());
          return;
        }

        if (await this.appService.isEmpty(ctx.chat.id)) {
          await ctx.reply('Список задач пуст!', actionButtons());
        } else {
          await ctx.reply(showList(todos), actionButtons());
        }
      } else {
        await ctx.replyWithHTML(
          'Напиши ID и новую категорию: \n\n' +
            'В формате - <b>ID. Новая категория</b>',
          editButtons(),
        );
        return;
      }
    }

    if (ctx.session.type === 'edit deadline') {
      const isValidFormat = /^\d+\..+/.test(message);
      const [taskId, taskDeadline] = message.split('. ');
      if (isValidFormat && taskDeadline) {
        const todos = await this.appService.editTaskDeadline(
          Number(taskId),
          taskDeadline,
          ctx.chat.id,
        );

        if (!todos) {
          await ctx.deleteMessage(ctx.message.message_id - 1);
          await ctx.reply('Задачи с таким ID не найдено...🤨', editButtons());
          return;
        }

        if (await this.appService.isEmpty(ctx.chat.id)) {
          await ctx.reply('Список задач пуст!', actionButtons());
        } else {
          await ctx.reply(showList(todos), actionButtons());
        }
      } else {
        await ctx.replyWithHTML(
          'Напиши ID и новый дедлайн: \n\n' +
            'В формате - <b>ID. Новый дедлайн</b>',
          editButtons(),
        );
        return;
      }
    }

    if (ctx.session.type === 'remove') {
      const todos = await this.appService.deleteTask(
        Number(message),
        ctx.chat.id,
      );

      if (!todos) {
        await ctx.deleteMessage(ctx.message.message_id - 1);
        await ctx.reply('Задачи с таким ID не найдено...🤨', actionButtons());
        return;
      }

      if (await this.appService.isEmpty(ctx.chat.id)) {
        await ctx.reply('Список задач пуст!', actionButtons());
      } else {
        await ctx.reply(showList(todos), actionButtons());
      }
    }
  }

  getHello() {
    return undefined;
  }
}
