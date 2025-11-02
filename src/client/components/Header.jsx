import React from 'react'

export default function Header({ user, onLogout, onMenuToggle }) {
  return (
    <header className="flex items-center justify-between p-4 border-b border-white/5 sticky top-0 bg-black/30 backdrop-blur z-10">
      <div className="flex items-center gap-4">
        <button onClick={onMenuToggle} className="md:hidden px-2 py-1 rounded bg-white/5">
          ☰
        </button>
      </div>
      <div className="flex items-center gap-3">
<div className="text-sm text-gray-300 hidden sm:block truncate max-w-xs">
  Logado como: <span>{user ? user.name : 'Usuário'}</span>
</div>
        <button onClick={onLogout} className="px-3 py-1 rounded bg-white/5">
          Sair
        </button>
      </div>
    </header>
  )
}
