import prisma from "../prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function register(req, res) {
  const { email, password, name } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "email e senha obrigatórios" });

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ error: "Usuário já existe" });

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hash, name },
  });

  res.json({ id: user.id, email: user.email, name: user.name });
}

export async function login(req, res) {
  console.log("Recebido login:", req.body);
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "email e senha obrigatórios" });

  const user = await prisma.user.findUnique({ where: { email } });
  console.log(user);
  if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Credenciais inválidas" });

  const token = jwt.sign(
    { uid: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "12h" }
  );

  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
}
