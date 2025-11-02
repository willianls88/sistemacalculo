import prisma from "../prisma.js";
import { startOfDay, endOfDay } from "date-fns";

export async function getDashboard(req, res) {
  try {
    const hojeInicio = startOfDay(new Date());
    const hojeFim = endOfDay(new Date());

    // Total de motoboys
    const totalMotoboys = await prisma.motoboy.count();

    // Entregas de hoje
    const entregasHoje = await prisma.rotaIndependente.count({
      where: {
        createdAt: {
          gte: hojeInicio,
          lte: hojeFim,
        },
      },
    });

    // Total de entregas
    const totalEntregas = await prisma.rotaIndependente.count();

    // Valor total de hoje
    const valorHoje = await prisma.rotaIndependente.aggregate({
      _sum: { valor: true },
      where: {
        createdAt: {
          gte: hojeInicio,
          lte: hojeFim,
        },
      },
    });

    // Valor total geral
    const valorTotal = await prisma.rotaIndependente.aggregate({
      _sum: { valor: true },
    });

    res.json({
      totalMotoboys,
      entregasHoje,
      totalEntregas,
      valorHoje: valorHoje._sum.valor || 0,
      valorTotal: valorTotal._sum.valor || 0,
    });
  } catch (error) {
    console.error("Erro ao obter dashboard:", error);
    res.status(500).json({ erro: error.message });
  }
}
