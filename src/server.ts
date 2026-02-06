import express, { Application } from "express";
import { AppDataSource } from "./config/data-source";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import taskRoutes from "./routes/TaskRoutes"; 
import * as dotenv from "dotenv";
import cors from "cors"; // CORS conexão com o Front-end

dotenv.config();

const app: Application = express();

// Middlewares base
app.use(cors()); // Permite que seu Front-end acesse a API sem erros de segurança
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Registro das Rotas da API
app.use("/api", authRoutes); // Login e Logout
app.use("/api", userRoutes); // Gerenciamento de usuários/perfil
app.use("/api", taskRoutes); // CRUD de Tarefas (id, titulo, concluida, etc)

const PORT = Number(process.env.PORT || "3000");

// Inicialização do Banco de Dados e Servidor
AppDataSource.initialize()
  .then(() => {
    console.log(" Banco de Dados conectado com sucesso!");
    app.listen(PORT, () => {
      console.log(` Servidor rodando em: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro durante a inicialização do Data Source:", err);
  });