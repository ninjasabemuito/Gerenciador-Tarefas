import { Router } from "express";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { UserController } from "../controllers/UserController";

const router = Router();
const auth = new AuthMiddleware();
const controller = new UserController();

router.get('/users/me', auth.authenticateToken, controller.show);

// Atualizar dados do usuário (ex: mudar nome ou senha)
router.put('/users/:id', auth.authenticateToken, controller.update);

// Deletar a própria conta
router.delete('/users/:id', auth.authenticateToken, controller.delete);

// Listar todos os usuários cadastrados (Apenas Admin)
router.get('/users', auth.authenticateToken, auth.isAdmin, controller.listAll);

// Listar usuários e suas tarefas
router.get('/users/tasks', auth.authenticateToken, auth.isAdmin, controller.list);

//Cadastrar usuarios
router.post('/users', controller.create)


export default router;