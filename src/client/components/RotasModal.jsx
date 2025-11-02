import React, { useState, useEffect } from 'react';
import api from '../api';

export default function RotasModal({ motoboyId, motoboyNome, onClose, onSave }) {
  const [cep, setCep] = useState('');
  const [numero, setNumero] = useState('');
  const [data, setData] = useState(() => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`; // formato ISO para input[type="date"]
  });
  const [rotas, setRotas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Buscar rotas do dia do motoboy
  useEffect(() => {
    async function fetchRotasDeHoje() {
      if (!motoboyId) return;
      try {
        const res = await api.get(`/rotas/${motoboyId}/hoje`);
        setRotas(res.data);
      } catch (err) {
        console.error('Erro ao carregar rotas:', err);
        alert('Erro ao carregar rotas do dia.');
      }
    }
    fetchRotasDeHoje();
  }, [motoboyId]);

  function formatCepInput(value) {
    let v = value.replace(/\D/g, '');
    if (v.length > 2) v = v.slice(0, 2) + '.' + v.slice(2);
    if (v.length > 6) v = v.slice(0, 6) + '-' + v.slice(6);
    if (v.length > 10) v = v.slice(0, 10);
    return v;
  }

  function handleCepChange(e) {
    setCep(formatCepInput(e.target.value));
  }

  async function addRota() {
    if (!cep || !numero || !data) {
      return alert('Informe CEP, número e data');
    }

    setLoading(true);
    const cepLimpo = cep.replace(/\D/g, '');

    try {
      const res = await api.post('/rotas/criar', {
        motoboyId,
        cep: cepLimpo,
        numero,
        createdAt: data, // data enviada para o banco
      });

      setRotas([...rotas, res.data.rota]);
      setCep('');
      setNumero('');
    } catch (err) {
      console.error('Erro ao adicionar rota:', err);
      alert(err.response?.data?.erro || 'Erro ao adicionar rota');
    } finally {
      setLoading(false);
    }
  }

  async function removeRota(id) {
    if (!window.confirm('Deseja realmente remover esta rota?')) return;
    try {
      await api.delete(`/rotas/${id}`);
      setRotas(rotas.filter(r => r.id !== id));
    } catch (err) {
      console.error('Erro ao remover rota:', err);
      alert('Erro ao remover rota do banco de dados.');
    }
  }

  const totalValor = rotas.reduce((acc, r) => acc + (r.valor || 0), 0).toFixed(2);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-40 p-2 overflow-auto">
      <div className="w-full max-w-2xl bg-gradient-to-b from-gray-900 to-neutral-900 rounded-xl p-6 overflow-auto max-h-[90vh]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <h4 className="text-lg font-semibold">Rotas de {motoboyNome}</h4>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <button onClick={onClose} className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition">
              Fechar
            </button>
            <button
              onClick={() => onSave(rotas)}
              className="px-3 py-1 rounded bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 transition"
            >
              Salvar Rotas
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={cep}
              onChange={handleCepChange}
              placeholder="CEP 00.000-000"
              className="flex-1 rounded bg-black/30 px-3 py-2"
              maxLength={10}
            />
            <input
              value={numero}
              onChange={e => setNumero(e.target.value)}
              placeholder="Número"
              className="w-full sm:w-28 rounded bg-black/30 px-3 py-2"
            />
            <input
              type="date"
              value={data}
              onChange={e => setData(e.target.value)}
              className="w-full sm:w-36 rounded bg-black/30 px-3 py-2"
            />
            <button
              onClick={addRota}
              disabled={loading}
              className={`px-3 py-2 rounded flex items-center justify-center gap-2 transition ${
                loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {loading ? 'Salvando...' : 'Adicionar'}
            </button>
          </div>

          {/* Lista de rotas sem mostrar a data */}
          <div className="bg-white/5 rounded p-3 max-h-64 overflow-auto">
            {rotas.length === 0 && (
              <div className="text-sm text-gray-300">Nenhuma rota adicionada</div>
            )}
            <ul className="space-y-2">
              {rotas.map(r => (
                <li
                  key={r.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-black/20 p-2 rounded"
                >
                  <div>
                    <div className="font-medium">
                      CEP: {r.cep} | Nº: {r.numero} | Valor: R${r.valor?.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => removeRota(r.id)}
                      className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white transition"
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {rotas.length > 0 && (
            <div className="mt-2 text-right font-semibold text-white">
              Valor Total: R${totalValor}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
