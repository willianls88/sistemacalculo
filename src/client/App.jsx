// App.jsx
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import ProtectedApp from './app/ProtectedApp'

/* ---------- Hook simples de autenticação ---------- */
function useAuth() {
  const [user, setUser] = React.useState(() => JSON.parse(localStorage.getItem('pizzaria_user')) || null)
  const login = (email) => {
    const u = { email, name: 'Admin Pizzaria' }
    setUser(u)
    localStorage.setItem('pizzaria_user', JSON.stringify(u))
  }
  const logout = () => {
    setUser(null)
    localStorage.removeItem('pizzaria_user')
  }
  return { user, login, logout }
}

/* ---------- App Root ---------- */
export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-neutral-900 to-gray-800 text-white">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<ProtectedAppWrapper />} />
        </Routes>
      </div>
    </Router>
  )
}

/* ---------- Wrapper para rotas protegidas ---------- */
function ProtectedAppWrapper() {
  const auth = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!auth.user) navigate('/login')
  }, [])

  return <ProtectedApp auth={auth} />
}
