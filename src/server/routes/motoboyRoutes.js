import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import * as controller from "../controllers/motoboyController.js";

const router = express.Router();

router.use(authenticate); // todas as rotas protegidas

router.get("/", controller.list);
router.get("/:id", controller.get);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

// Rotas específicas
router.post("/:id/rotas", controller.addRota);
router.delete("/:id/rotas/:rotaId", controller.removeRota);

export default router;
