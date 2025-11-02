import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./src/server/routes/authRoutes.js";
import motoboyRoutes from "./src/server/routes/motoboyRoutes.js";
import rotaRoutes from "./src/server/routes/rotaRoutes.js";
import dashboardRoutes from "./src/server/routes/dashboardRoutes.js";
import usuariosRoutes from "./src/server/routes/usuariosRoutes.js";
import entregasRouter from "./src/server/routes/rotaRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rotas do backend
app.use("/api/auth", authRoutes);
app.use("/api/motoboys", motoboyRoutes);
app.use("/api/rotas", rotaRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/entregas", entregasRouter);

// Servir frontend buildado
app.use(express.static(path.join(process.cwd(), "dist")));

// Todas as outras rotas vão para o index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "dist/index.html"));
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
