import dotenv from "dotenv";
dotenv.config();
import prisma from "../prisma.js";
import axios from "axios";

const PIZZARIA_ENDERECO = "Av. Uirapuru, 26 - Jardim Claudia, Pinhais - PR, 83326-430";
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// 🔹 Obter endereço via CEP
async function obterEnderecoPorCep(cep) {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    if (response.data.erro) throw new Error("CEP inválido");
    return response.data;
  } catch (err) {
    console.error("Erro ao buscar CEP:", err.message);
    throw new Error("Erro ao buscar endereço pelo CEP");
  }
}

// 🔹 Obter coordenadas via Google Maps
async function obterCoordenadas(endereco) {
  try {
    const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: { address: endereco, key: GOOGLE_MAPS_API_KEY },
    });
    if (response.data.status !== "OK" || !response.data.results.length) {
      console.error("⚠️ Google Maps não retornou resultados:", response.data.status);
      throw new Error(`Endereço não encontrado: ${endereco}`);
    }

    const location = response.data.results[0].geometry.location;
    return `${location.lat},${location.lng}`;
  } catch (err) {
    console.error("Erro ao obter coordenadas:", err.message);
    throw new Error(`Falha ao buscar coordenadas de "${endereco}"`);
  }
}

// 🔹 Calcular distância via Google Maps Directions API
async function calcularDistancia(origem, destino) {
  const response = await axios.get("https://maps.googleapis.com/maps/api/directions/json", {
    params: {
      origin: origem,
      destination: destino,
      key: GOOGLE_MAPS_API_KEY,
      mode: "bicycling",
    },
  });

  if (!response.data.routes.length) {
    throw new Error("Não foi possível calcular a rota entre os endereços.");
  }

  const leg = response.data.routes[0].legs[0];
  return {
    distancia: leg.distance.text,
    duracao: leg.duration.text,
    distanciaMetros: leg.distance.value, // metros
  };
}

// 🔹 Função para arredondar km conforme regra
function arredondarKm(distanciaKm) {
  const parteInteira = Math.floor(distanciaKm);
  const decimal = distanciaKm - parteInteira;
  if (decimal <= 0.1) {
  return parteInteira;
  }  else {
  return parteInteira + 1;  
  }
  
  
}

// 🔹 Criar rota independente
export async function criarRotaIndependente(req, res) {
  try {
    const { motoboyId, cep, numero, createdAt } = req.body;

    if (!motoboyId || !cep || !numero) {
      return res.status(400).json({ erro: "Informe motoboyId, CEP e número." });
    }

    // 🕒 Converte createdAt enviado (yyyy-mm-dd) para data com timezone -03:00
    const createdAtISO =
      createdAt && typeof createdAt === "string"
        ? new Date(`${createdAt}T00:00:00-03:00`)
        : undefined;

    const dadosCep = await obterEnderecoPorCep(cep);
    const enderecoCliente = `${dadosCep.logradouro}, ${numero}, ${dadosCep.bairro}, ${dadosCep.localidade}, ${dadosCep.uf}, Brasil`;

    const origem = await obterCoordenadas(PIZZARIA_ENDERECO);
    const destino = await obterCoordenadas(enderecoCliente);

    const { distancia, duracao, distanciaMetros } = await calcularDistancia(origem, destino);

    const distanciaKm = distanciaMetros / 1000;
    const distanciaArredondada = arredondarKm(distanciaKm);

    let valor = distanciaArredondada <= 3 ? 5 : 5 + (distanciaArredondada - 3) * 1;
    valor = parseFloat(valor.toFixed(2));

    const rota = await prisma.rotaIndependente.create({
      data: {
        motoboyId: Number(motoboyId),
        cep,
        numero,
        valor,
        ...(createdAtISO && { createdAt: createdAtISO }),
      },
    });

    return res.json({
      rota,
      enderecoCliente,
      distancia,
      duracao,
      valor,
    });
  } catch (erro) {
    console.error("❌ Erro ao criar rota independente:", erro);
    res.status(500).json({ erro: erro.message });
  }
}



// 🔹 Buscar rotas do motoboy de hoje
export async function listarRotasDeHoje(req, res) {
  try {
    const motoboyId = Number(req.params.id);
    if (!motoboyId) return res.status(400).json({ erro: "Motoboy inválido" });

    const inicioDoDia = new Date();
    inicioDoDia.setHours(0, 0, 0, 0);

    const fimDoDia = new Date();
    fimDoDia.setHours(23, 59, 59, 999);

    const rotas = await prisma.rotaIndependente.findMany({
      where: {
        motoboyId,
        createdAt: {
          gte: inicioDoDia,
          lte: fimDoDia,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(rotas);
  } catch (erro) {
    console.error("Erro ao listar rotas de hoje:", erro);
    res.status(500).json({ erro: "Erro ao buscar rotas" });
  }
}

// 🔹 Listar todas as entregas com filtros
export async function listarEntregas(req, res) {
  try {
    const { nomeMotoboy, cep, numero, valor, dataInicial, dataFinal } = req.query;

    const filtros = {};

    // 🔍 Filtro por nome do motoboy
    if (nomeMotoboy) {
      filtros.motoboy = {
        nome: {
          contains: nomeMotoboy,
        },
      };
    }

    // 🔍 Filtro por CEP (busca parcial também)
    if (cep) {
      filtros.cep = {
        contains: cep.replace(/\D/g, ''), // remove máscara
      };
    }

    // 🔍 Filtro por número (busca exata)
    if (numero) {
      filtros.numero = {
        equals: numero,
      };
    }

    // 🔍 Filtro por valor (igual ou aproximadamente igual)
    if (valor) {
      const valorNumber = parseFloat(valor);
      if (!isNaN(valorNumber)) {
        filtros.valor = {
          gte: valorNumber - 0.009,
          lte: valorNumber + 0.009,
        };
      }
    }

    // 🔍 Filtro por intervalo de datas
    if (dataInicial || dataFinal) {
      filtros.createdAt = {};
      if (dataInicial) {
        const [ano, mes, dia] = dataInicial.split('-');
        filtros.createdAt.gte = new Date(Date.UTC(ano, mes - 1, dia, 0, 0, 0));
      }
      if (dataFinal) {
        const [ano, mes, dia] = dataFinal.split('-');
        filtros.createdAt.lte = new Date(Date.UTC(ano, mes - 1, dia, 23, 59, 59, 999));
      }
    }

    // 🔎 Consulta Prisma
    const entregas = await prisma.rotaIndependente.findMany({
      where: filtros,
      orderBy: { createdAt: 'desc' },
      include: { motoboy: true },
    });

    res.json(entregas);
  } catch (erro) {
    console.error('Erro ao listar entregas:', erro);
    res.status(500).json({ erro: 'Erro ao buscar entregas' });
  }
}




// 🔹 Remover rota
export async function removerRota(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ erro: "ID inválido" });

    await prisma.rotaIndependente.delete({ where: { id } });
    res.json({ sucesso: true });
  } catch (erro) {
    console.error("Erro ao remover rota:", erro);
    res.status(500).json({ erro: "Erro ao remover rota" });
  }
}
