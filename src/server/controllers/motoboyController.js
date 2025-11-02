import prisma from "../prisma.js";

export async function list(req, res) {
  const motoboys = await prisma.motoboy.findMany({ include: { rotas: true } });
  res.json(motoboys);
}

export async function get(req, res) {
  const id = Number(req.params.id);
  const m = await prisma.motoboy.findUnique({ where: { id }, include: { rotas: true } });
  if (!m) return res.status(404).json({ error: "Motoboy não encontrado" });
  res.json(m);
}

export async function create(req, res) {
  const { nome, telefone, veiculo, ativo } = req.body;
  const m = await prisma.motoboy.create({ data: { nome, telefone, veiculo, ativo } });
  res.json(m);
}

export async function update(req, res) {
  const id = Number(req.params.id);
  const { nome, telefone, veiculo, ativo } = req.body;
  const m = await prisma.motoboy.update({ where: { id }, data: { nome, telefone, veiculo, ativo } });
  res.json(m);
}

export async function remove(req, res) {
  const id = Number(req.params.id);
  await prisma.rota.deleteMany({ where: { motoboyId: id } });
  await prisma.motoboy.delete({ where: { id } });
  res.json({ ok: true });
}

export async function addRota(req, res) {
  const motoboyId = Number(req.params.id);
  const { endereco, observacao } = req.body;
  const rota = await prisma.rota.create({ data: { endereco, observacao, motoboyId } });
  res.json(rota);
}

export async function removeRota(req, res) {
  const rotaId = Number(req.params.rotaId);
  await prisma.rota.delete({ where: { id: rotaId } });
  res.json({ ok: true });
}
