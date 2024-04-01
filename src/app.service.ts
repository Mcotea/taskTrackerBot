import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async getAll(chatId: number) {
    return this.taskRepository.find({
      where: {
        chatId: chatId,
      },
    });
  }

  async isEmpty(chatId: number) {
    const count = await this.taskRepository.count({
      where: {
        chatId: chatId,
      },
    });
    return count === 0;
  }
  async getById(id: number, chatId: number) {
    return this.taskRepository.findOneBy({ id, chatId });
  }

  async createTask(name: string, chatId: number) {
    const task = this.taskRepository.create({ name, chatId });

    await this.taskRepository.save(task);
    return this.getAll(chatId);
  }

  async doneTask(id: number, chatId: number) {
    const task = await this.getById(id, chatId);
    if (!task) return null;

    task.isCompleted = !task.isCompleted;
    await this.taskRepository.save(task);
    return this.getAll(chatId);
  }

  async editTaskName(id: number, name: string, chatId: number) {
    const task = await this.getById(id, chatId);
    if (!task) return null;

    task.name = name;
    await this.taskRepository.save(task);

    return this.getAll(chatId);
  }

  async editTaskTag(id: number, tag: string, chatId: number) {
    const task = await this.getById(id, chatId);
    if (!task) return null;

    task.tag = tag;
    await this.taskRepository.save(task);

    return this.getAll(chatId);
  }

  async editTaskDeadline(id: number, deadline: string, chatId: number) {
    const task = await this.getById(id, chatId);
    if (!task) return null;

    task.deadline = deadline;
    await this.taskRepository.save(task);

    return this.getAll(chatId);
  }

  async deleteTask(id: number, chatId: number) {
    const task = await this.getById(id, chatId);
    if (!task) return null;

    await this.taskRepository.delete({ id, chatId });

    return this.getAll(chatId);
  }
}
