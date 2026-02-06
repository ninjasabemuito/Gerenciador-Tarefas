import { Request, Response } from "express";
import { TaskRepository } from "../repositories/TaskRepository";

const taskRepository = new TaskRepository();

export class TaskController {
  
  // Listar todas as tarefas do usuário
  async list(req: Request, res: Response) {
    try {
      const tasks = await taskRepository.findByUser(req.user.id);
      return res.json(tasks);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao listar tarefas" });
    }
  }

  // Criar nova tarefa
  async create(req: Request, res: Response) {
    try {
      const { titulo, descricao } = req.body;
      if (!titulo) return res.status(400).json({ message: "Título é obrigatório" });

      const newTask = await taskRepository.createAndSave({
        titulo,
        descricao,
        concluida: false,
        user: req.user.id // Pegamos o ID do token de autenticação
      });

      return res.status(201).json(newTask);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar tarefa" });
    }
  }

  // Atualizar (marcar como concluída ou mudar texto)
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { titulo, descricao, concluida } = req.body;

      const task = await taskRepository.findById(Number(id));
      if (!task || task.user.id !== req.user.id) {
        return res.status(404).json({ message: "Tarefa não encontrada" });
      }

      if (titulo !== undefined) task.titulo = titulo;
      if (descricao !== undefined) task.descricao = descricao;
      if (concluida !== undefined) task.concluida = concluida;

      const updatedTask = await taskRepository.save(task);
      return res.json(updatedTask);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao atualizar" });
    }
  }

  // Remover tarefa
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const task = await taskRepository.findById(Number(id));

      if (!task || task.user.id !== req.user.id) {
        return res.status(404).json({ message: "Tarefa não encontrada" });
      }

      await taskRepository.removeTask(task);
      return res.status(204).send(); // Sucesso sem conteúdo
    } catch (error) {
      return res.status(500).json({ message: "Erro ao remover tarefa" });
    }
  }
}