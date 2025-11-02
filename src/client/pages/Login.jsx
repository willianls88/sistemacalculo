import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api' // 🔥 usa o axios configurado

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ✅ Verifica token já existente (ex: recarregar página)
  useEffect(() => {
    async function verificarToken() {
      const token = localStorage.getItem('pizzaria_token')
      if (!token) return

      try {
        const res = await api.get('/auth/verificar')
        if (res.data?.ok) navigate('/')
      } catch {
        localStorage.removeItem('pizzaria_token')
        localStorage.removeItem('pizzaria_user')
      }
    }

    verificarToken()
  }, [navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('pizzaria_token', res.data.token)
      localStorage.setItem('pizzaria_user', JSON.stringify(res.data.user))
      navigate('/')
    } catch (err) {
      console.error('Erro no login:', err)
      if (err.response?.data?.erro) {
        setError(err.response.data.erro)
      } else {
        setError('Falha ao conectar ao servidor.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-red-800 via-black to-yellow-800">
      <div className="w-full max-w-md bg-white/5 backdrop-blur rounded-2xl p-8 shadow-2xl border border-white/10">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-red-600 to-yellow-300 flex items-center justify-center text-3xl font-bold shadow-lg">
            🍕
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-white">Pizzaria Pop</h1>
          <p className="text-sm text-gray-300">
            Sistema para cálculo de pagamento de entregas
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-gray-300">E-mail</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg bg-black/30 border border-gray-700 px-3 py-2 focus:outline-none focus:border-red-500 text-white"
              placeholder="seu@exemplo.com"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-300">Senha</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg bg-black/30 border border-gray-700 px-3 py-2 focus:outline-none focus:border-red-500 text-white"
              placeholder="••••••"
              required
            />
          </label>

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg bg-gradient-to-r from-red-600 to-yellow-500 text-white font-semibold shadow-lg hover:opacity-90 transition ${
              loading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
