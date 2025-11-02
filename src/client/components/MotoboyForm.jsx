import React, { useState } from 'react'

export default function MotoboyForm({ initial = {}, onClose, onSave }) {
  const [nome, setNome] = useState(initial.nome || '')
  const [ativo, setAtivo] = useState(initial.ativo ?? true)

  function handleSubmit(e) {
    e.preventDefault()
    const payload = { ...initial, nome, ativo }
    onSave(payload)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-40 p-2">
      <div className="w-full max-w-lg bg-gradient-to-b from-gray-900 to-neutral-900 rounded-xl p-6 overflow-auto max-h-[90vh]">
        <h4 className="text-lg font-semibold mb-4">
          {initial.id ? 'Editar Motoboy' : 'Novo Motoboy'}
        </h4>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm text-gray-300">Nome</label>
            <input
              value={nome}
              onChange={e => setNome(e.target.value)}
              className="mt-1 block w-full rounded bg-black/30 px-3 py-2"
            />
          </div>

          <div className="w-full sm:w-28">
            <label className="text-sm text-gray-300">Ativo</label>
            <select
              value={ativo}
              onChange={e => setAtivo(e.target.value === 'true')}
              className="mt-1 block w-full rounded bg-black/30 px-3 py-2"
            >
              <option value={true}>Sim</option>
              <option value={false}>Não</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-2 flex-wrap">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-white/5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-gradient-to-r from-red-600 to-red-500"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
