import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'task' })
export class TaskEntity {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'int' })
  chatId: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ default: '❌' })
  tag: string;

  @Column({ default: '❌' })
  deadline: string;
}
