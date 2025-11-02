// createTestUser.js
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const email = "teste@gmail.com";    // email de teste
  const password = "eu009442";          // senha de teste

  // Gera hash compatível com bcrypt do Node
  const hashedPassword = await bcrypt.hash(password, 10);

  // Cria usuário no banco
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  console.log("Usuário criado com sucesso:", user);
}

main()
  .catch(e => {
    console.error("Erro ao criar usuário:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
