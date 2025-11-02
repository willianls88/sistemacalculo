import React, { useState, useEffect } from 'react';
import api from '../api';
import * as XLSX from 'xlsx';

export default function Entregas() {
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filtros
  const [nomeMotoboy, setNomeMotoboy] = useState('');
  const [cep, setCep] = useState('');
  const [numero, setNumero] = useState('');
  const [valor, setValor] = useState(''); // string visual
  const [valorDecimal, setValorDecimal] = useState(undefined); // número para backend
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);

  // Ordenação
  const [ordenarPor, setOrdenarPor] = useState('');
  const [ordenarAsc, setOrdenarAsc] = useState(true);

  useEffect(() => {
    fetchEntregas();
  }, []);

  async function fetchEntregas() {
    setLoading(true);
    try {
      const res = await api.get('/entregas', {
        params: {
          nomeMotoboy: nomeMotoboy || undefined,
          cep: cep.replace(/\D/g, '') || undefined,
          numero: numero || undefined,
          valor: valorDecimal || undefined,
          dataInicial: dataInicial || undefined,
          dataFinal: dataFinal || undefined,
        },
      });
      setEntregas(res.data);
      setPaginaAtual(1);
    } catch (err) {
      console.error('Erro ao buscar entregas:', err);
      alert('Erro ao buscar entregas');
    } finally {
      setLoading(false);
    }
  }

  function exportToExcel() {
    const dadosParaExcel = entregas.map(e => ({
      Motoboy: e.motoboy?.nome || e.motoboyId,
      CEP: formatarCep(e.cep),
      Número: e.numero,
      Valor: formatarValor(e.valor),
      Data: new Date(e.createdAt).toLocaleDateString('pt-BR'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dadosParaExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Entregas');
    XLSX.writeFile(workbook, 'entregas.xlsx');
  }

  // 🔢 Helpers
  function formatarValor(v) {
    if (v == null) return '';
    return Number(v).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function formatarCep(cep) {
    if (!cep) return '';
    const apenasNum = cep.toString().replace(/\D/g, '');
    if (apenasNum.length === 8) {
      return apenasNum.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2-$3');
    }
    return cep;
  }

  function maskCep(value) {
    const apenasNum = value.replace(/\D/g, '');
    let masked = apenasNum;
    if (apenasNum.length > 2) masked = apenasNum.slice(0, 2) + '.' + apenasNum.slice(2);
    if (apenasNum.length > 5) masked = masked.slice(0, 6) + '-' + apenasNum.slice(5, 8);
    return masked;
  }

  function handleOrdenar(coluna) {
    if (ordenarPor === coluna) {
      setOrdenarAsc(!ordenarAsc);
    } else {
      setOrdenarPor(coluna);
      setOrdenarAsc(true);
    }
  }

  const getNestedValue = (obj, path) => path.split('.').reduce((acc, key) => acc?.[key], obj);

  const entregasOrdenadas = [...entregas].sort((a, b) => {
    if (!ordenarPor) return 0;
    const aVal = getNestedValue(a, ordenarPor);
    const bVal = getNestedValue(b, ordenarPor);
    if (aVal < bVal) return ordenarAsc ? -1 : 1;
    if (aVal > bVal) return ordenarAsc ? 1 : -1;
    return 0;
  });

  const totalPaginas = Math.ceil(entregasOrdenadas.length / itensPorPagina);
  const entregasPagina = entregasOrdenadas.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  const totalValor = entregas.reduce((soma, e) => soma + (Number(e.valor) || 0), 0);

  function limparFiltros() {
    setNomeMotoboy('');
    setCep('');
    setNumero('');
    setValor('');
    setValorDecimal(undefined);
    setDataInicial('');
    setDataFinal('');
    fetchEntregas();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Entregas</h3>
        <button
          onClick={exportToExcel}
          className="px-3 py-2 rounded bg-green-600 text-white shadow hover:opacity-90"
        >
          Exportar Excel
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap mb-4">
        <input
          type="text"
          placeholder="Nome do Motoboy"
          value={nomeMotoboy}
          onChange={e => setNomeMotoboy(e.target.value)}
          className="p-2 rounded bg-white/5 text-white placeholder-gray-400"
        />

        {/* CEP com máscara */}
        <input
          type="text"
          placeholder="CEP"
          value={cep}
          onChange={e => setCep(maskCep(e.target.value))}
          onBlur={() => setCep(formatarCep(cep))}
          className="p-2 rounded bg-white/5 text-white placeholder-gray-400"
        />

        <input
          type="text"
          placeholder="Número"
          value={numero}
          onChange={e => setNumero(e.target.value.replace(/\D/g, ''))}
          className="p-2 rounded bg-white/5 text-white placeholder-gray-400"
        />

        {/* Valor com máscara BRL */}
        <input
          type="text"
          placeholder="Valor"
          value={valor}
          onChange={e => {
            const apenasNumeros = e.target.value.replace(/[^\d,]/g, '');
            setValor(apenasNumeros);
            const num = parseFloat(apenasNumeros.replace(',', '.'));
            setValorDecimal(isNaN(num) ? undefined : num);
          }}
          onBlur={() => {
            if (valorDecimal != null) {
              setValor(valorDecimal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
            }
          }}
          className="p-2 rounded bg-white/5 text-white placeholder-gray-400 w-28"
        />

        <input
          type="date"
          placeholder="Data Inicial"
          value={dataInicial}
          onChange={e => setDataInicial(e.target.value)}
          className="p-2 rounded bg-white/5 text-white"
        />
        <input
          type="date"
          placeholder="Data Final"
          value={dataFinal}
          onChange={e => setDataFinal(e.target.value)}
          className="p-2 rounded bg-white/5 text-white"
        />
        <button
          onClick={fetchEntregas}
          className="px-3 py-2 rounded bg-blue-600 text-white hover:opacity-90"
        >
          Filtrar
        </button>
        <button
          onClick={limparFiltros}
          className="px-3 py-2 rounded bg-gray-600 text-white hover:opacity-90"
        >
          Limpar
        </button>
      </div>

      {loading ? (
        <div className="text-gray-300">Carregando entregas...</div>
      ) : (
        <>
          <div className="bg-white/5 rounded-xl overflow-auto">
            <table className="w-full min-w-[700px] table-auto">
              <thead className="text-sm text-gray-300">
                <tr>
                  <th className="p-3 text-left cursor-pointer" onClick={() => handleOrdenar('motoboy.nome')}>
                    Motoboy {ordenarPor === 'motoboy.nome' ? (ordenarAsc ? '▲' : '▼') : ''}
                  </th>
                  <th className="p-3 text-left">CEP</th>
                  <th className="p-3 text-left">Número</th>
                  <th className="p-3 text-left">Valor</th>
                  <th className="p-3 text-left cursor-pointer" onClick={() => handleOrdenar('createdAt')}>
                    Data {ordenarPor === 'createdAt' ? (ordenarAsc ? '▲' : '▼') : ''}
                  </th>
                </tr>
              </thead>
              <tbody>
                {entregasPagina.map(e => (
                  <tr key={e.id} className="border-t border-white/5 hover:bg-white/10 cursor-pointer">
                    <td className="p-3">{e.motoboy?.nome || e.motoboyId}</td>
                    <td className="p-3">{formatarCep(e.cep)}</td>
                    <td className="p-3">{e.numero}</td>
                    <td className="p-3">{formatarValor(e.valor)}</td>
                    <td className="p-3">{new Date(e.createdAt).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totalizador: valor e registros */}
          <div className="flex justify-end text-lg font-semibold text-white mt-3 pr-4 gap-6">
            <span>Total: {formatarValor(totalValor)}</span>
            <span>Registros: {entregas.length}</span>
          </div>
        </>
      )}

      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
          disabled={paginaAtual === 1}
          className="px-3 py-1 rounded bg-white/10 hover:bg-white/20"
        >
          Anterior
        </button>
        <span className="px-3 py-1">{paginaAtual} / {totalPaginas}</span>
        <button
          onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
          disabled={paginaAtual === totalPaginas}
          className="px-3 py-1 rounded bg-white/10 hover:bg-white/20"
        >
          Próximo
        </button>
      </div>
    </div>
  );
}
