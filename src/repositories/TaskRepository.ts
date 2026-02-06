import { AppDataSource } from '../config/data-source';
import { Task } from '../models/Task';
import { Repository } from 'typeorm';

export class TaskRepository {
  private repository: Repository<Task>;

  constructor() {
    this.repository = AppDataSource.getRepository(Task);
  }

  // Lista apenas as tarefas do usuário logado 
  async findByUser(userId: number): Promise<Task[]> {
    return this.repository.find({
      where: { user: { id: userId } },
      order: { dataCriacao: 'DESC' }
    });
  }

  async findById(id: number): Promise<Task | null> {
    return this.repository.findOne({ where: { id }, relations: ['user'] });
  }

  async createAndSave(data: Partial<Task>): Promise<Task> {
    const task = this.repository.create(data);
    return this.repository.save(task);
  }

  async save(task: Task): Promise<Task> {
    return this.repository.save(task);
  }

  async removeTask(task: Task): Promise<Task> {
    return this.repository.remove(task);
  }
}