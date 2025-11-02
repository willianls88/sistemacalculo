import React, { useState, useEffect } from 'react'
import api from '../api'
import UsuariosForm from '../components/UsuariosForm'
import ConfirmModal from '../components/ConfirmModal'

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [selectedUsuario, setSelectedUsuario] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUsuarios()
  }, [])

  async function fetchUsuarios() {
    setLoading(true)
    try {
      const res = await api.get('/usuarios')
      setUsuarios(res.data)
    } catch (err) {
      console.error('Erro ao buscar usuários:', err)
      alert('Erro ao buscar usuários')
    } finally {
      setLoading(false)
    }
  }

  function handleAdd() {
    setSelectedUsuario({})
    setShowForm(true)
  }

  function handleEdit(usuario) {
    setSelectedUsuario(usuario)
    setShowForm(true)
  }

  function handleDelete(usuario) {
    setSelectedUsuario(usuario)
    setShowDeleteModal(true)
  }

  async function confirmDelete() {
    try {
      await api.delete(`/usuarios/${selectedUsuario.id}`)
      setShowDeleteModal(false)
      fetchUsuarios()
    } catch (err) {
      console.error('Erro ao deletar usuário:', err)
      alert('Erro ao deletar usuário')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Usuários</h3>
        <button
          onClick={handleAdd}
          className="px-3 py-2 rounded bg-gradient-to-r from-red-600 to-red-500 text-white shadow hover:opacity-90"
        >
          + Adicionar Usuário
        </button>
      </div>

      {loading ? (
        <div className="text-gray-300">Carregando usuários...</div>
      ) : (
        <div className="bg-white/5 rounded-xl overflow-auto">
          <table className="w-full min-w-[500px] table-auto">
            <thead className="text-sm text-gray-300">
              <tr>
                <th className="p-3 text-left">Nome</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr
                  key={u.id}
                  className="border-t border-white/5 hover:bg-white/10 cursor-pointer"
                  onDoubleClick={() => handleEdit(u)}
                >
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(u)}
                      className="px-2 py-1 rounded bg-white/10 hover:bg-white/20"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(u)}
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

      {/* Modal de formulário */}
      {showForm && (
        <UsuariosForm
          initial={selectedUsuario}
          onClose={() => setShowForm(false)}
          onSave={async data => {
            try {
              if (data.id) {
                await api.put(`/usuarios/${data.id}`, data)
              } else {
                await api.post('/usuarios', data)
              }
              setShowForm(false)
              fetchUsuarios()
            } catch (err) {
              console.error('Erro ao salvar usuário:', err.response?.data || err.message)
              alert('Erro ao salvar usuário')
            }
          }}
        />
      )}

      {/* Modal de confirmação */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Confirmação de exclusão"
        message={`Tem certeza que deseja deletar ${selectedUsuario?.name}?`}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
