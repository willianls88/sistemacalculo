import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import api from '../api' // ✅ usa o Axios configurado

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await api.get('/dashboard') // ✅ rota automática com token
        setData(res.data)
      } catch (error) {
        console.error('❌ Erro ao carregar dashboard:', error)
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) {
    return <div className="text-center text-gray-400 mt-6">Carregando...</div>
  }

  if (!data) {
    return <div className="text-center text-red-400 mt-6">Erro ao carregar dados.</div>
  }

  // ✅ Formata valores em BRL
  function formatBRL(valor) {
    return (
      valor?.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
      }) || 'R$ 0,00'
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card
          title="Motoboys"
          value={data.totalMotoboys}
          className="shadow-2xl rounded-xl p-4 hover:shadow-[0_0_25px_rgba(0,0,0,0.4)] transition-shadow"
        />
        <Card
          title="Entregas Hoje"
          value={data.entregasHoje}
          className="shadow-2xl rounded-xl p-4 hover:shadow-[0_0_25px_rgba(0,0,0,0.4)] transition-shadow"
        />
        <Card
          title="Total de Entregas"
          value={data.totalEntregas}
          className="shadow-2xl rounded-xl p-4 hover:shadow-[0_0_25px_rgba(0,0,0,0.4)] transition-shadow"
        />
        <Card
          title="Valor Total Hoje"
          value={formatBRL(data.valorHoje)}
          className="shadow-2xl rounded-xl p-4 hover:shadow-[0_0_25px_rgba(0,0,0,0.4)] transition-shadow"
        />
        <Card
          title="Valor Total"
          value={formatBRL(data.valorTotal)}
          className="shadow-2xl rounded-xl p-4 hover:shadow-[0_0_25px_rgba(0,0,0,0.4)] transition-shadow"
        />
      </div>
    </div>
  )
}
