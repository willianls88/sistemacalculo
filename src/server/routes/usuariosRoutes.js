import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import * as controller from "../controllers/usuariosController.js";

const router = express.Router();

// Todas as rotas protegidas
router.use(authenticate);

// Rotas CRUD de usuários
router.get("/", controller.list);          // Listar todos usuários
router.get("/:id", controller.get);        // Obter usuário por ID
router.post("/", controller.create);       // Criar novo usuário
router.put("/:id", controller.update);     // Atualizar usuário existente
router.delete("/:id", controller.remove);  // Remover usuário

export default router;
