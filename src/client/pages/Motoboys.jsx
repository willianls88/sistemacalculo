import React, { useState, useEffect } from 'react'
import api from '../api'
import MotoboyForm from '../components/MotoboyForm'
import RotasModal from '../components/RotasModal'
import ConfirmModal from '../components/ConfirmModal'

export default function Motoboys() {
  const [motoboys, setMotoboys] = useState([])
  const [selectedMotoboy, setSelectedMotoboy] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showRotasModal, setShowRotasModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMotoboys()
  }, [])

  async function fetchMotoboys() {
    setLoading(true)
    try {
      const res = await api.get('/motoboys')
      setMotoboys(res.data)
    } catch (err) {
      console.error('Erro ao buscar motoboys:', err)
      alert('Erro ao buscar motoboys')
    } finally {
      setLoading(false)
    }
  }

  function handleAdd() {
    setSelectedMotoboy({})
    setShowForm(true)
  }

  function handleEdit(motoboy) {
    setSelectedMotoboy(motoboy)
    setShowForm(true)
  }

  function handleRotas(motoboy) {
    if (!motoboy?.id) return
    setSelectedMotoboy(motoboy)
    setShowRotasModal(true)
  }

  function handleDelete(motoboy) {
    setSelectedMotoboy(motoboy)
    setShowDeleteModal(true)
  }

  async function confirmDelete() {
    try {
      await api.delete(`/motoboys/${selectedMotoboy.id}`)
      setShowDeleteModal(false)
      fetchMotoboys()
    } catch (err) {
      console.error('Erro ao deletar motoboy:', err)
      alert('Erro ao deletar motoboy')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Motoboys</h3>
        <button
          onClick={handleAdd}
          className="px-3 py-2 rounded bg-gradient-to-r from-red-600 to-red-500 text-white shadow hover:opacity-90"
        >
          + Adicionar Motoboy
        </button>
      </div>

      {loading ? (
        <div className="text-gray-300">Carregando motoboys...</div>
      ) : (
        <div className="bg-white/5 rounded-xl overflow-auto">
          <table className="w-full min-w-[500px] table-auto">
            <thead className="text-sm text-gray-300">
              <tr>
                <th className="p-3 text-left">Nome</th>
                <th className="p-3 text-left">Ativo</th>
                <th className="p-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {motoboys.map(m => (
                <tr
                  key={m.id}
                  className="border-t border-white/5 hover:bg-white/10 cursor-pointer"
                  onDoubleClick={() => handleEdit(m)}
                >
                  <td className="p-3">{m.nome}</td>
                  <td className="p-3">{m.ativo ? 'Sim' : 'Não'}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(m)}
                      className="px-2 py-1 rounded bg-white/10 hover:bg-white/20"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleRotas(m)}
                      className="px-2 py-1 rounded bg-white/10 hover:bg-white/20"
                    >
                      Rotas
                    </button>
                    <button
                      onClick={() => handleDelete(m)}
                      className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de adicionar/editar motoboy */}
      {showForm && (
        <MotoboyForm
          initial={selectedMotoboy}
          onClose={() => setShowForm(false)}
          onSave={async data => {
            try {
              if (data.id) {
                await api.put(`/motoboys/${data.id}`, data)
              } else {
                await api.post('/motoboys', data)
              }
              setShowForm(false)
              fetchMotoboys()
            } catch (err) {
              console.error('Erro ao salvar motoboy:', err)
              alert('Erro ao salvar motoboy')
            }
          }}
        />
      )}

      {/* Modal de rotas */}
      {showRotasModal && selectedMotoboy?.id && (
        <RotasModal
          motoboyId={selectedMotoboy.id}
          motoboyNome={selectedMotoboy.nome}
          onClose={() => setShowRotasModal(false)}
          onSave={rotas => {
            setShowRotasModal(false)
          }}
        />
      )}

      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Confirmação de exclusão"
        message={`Tem certeza que deseja deletar ${selectedMotoboy?.nome}?`}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
