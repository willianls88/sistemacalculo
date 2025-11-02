import express from "express";
import { 
  criarRotaIndependente, 
  listarRotasDeHoje, 
  removerRota,
  listarEntregas // ✅ nova função do controller
} from "../controllers/rotaController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticate);

// Criar nova rota independente
router.post("/criar", criarRotaIndependente);

// Buscar rotas do motoboy de hoje
router.get("/:id/hoje", listarRotasDeHoje);

// Remover rota
router.delete("/:id", removerRota);

// ✅ Listar todas as entregas (com filtros opcionais)
router.get("/", listarEntregas);

export default router;
