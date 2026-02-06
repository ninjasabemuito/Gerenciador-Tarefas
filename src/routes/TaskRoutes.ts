import { Router } from 'express';
import { TaskController } from '../controllers/TaskController'; 
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

const router = Router();
const taskController = new TaskController();
const auth = new AuthMiddleware();

// Rota para listar tarefas (GET /tasks)
router.get('/tasks', auth.authenticateToken, taskController.list);

// Rota para criar tarefa (POST /tasks)
router.post('/tasks', auth.authenticateToken, taskController.create);

// Rota para atualizar (PUT /tasks/:id) - Requisito: Atualizar uma tarefa
router.put('/tasks/:id', auth.authenticateToken, taskController.update);

// Rota para remover (DELETE /tasks/:id) - Requisito: Remover uma tarefa
router.delete('/tasks/:id', auth.authenticateToken, taskController.delete);

export default router;
