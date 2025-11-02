import React, { useState, useEffect } from 'react';

export default function UsuariosForm({ initial = {}, onClose, onSave }) {
  const [name, setName] = useState(initial.name || '');
  const [email, setEmail] = useState(initial.email || '');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setPassword('');
    setErrors({});
  }, [initial]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!email.trim()) newErrors.email = 'Email é obrigatório';
    else if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(email)) newErrors.email = 'Email inválido';
    if (!initial.id && (!password || password.length < 6)) newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    if (password && password.length > 0 && password.length < 6) newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...initial,
      name: name.trim(),
      email: email.trim(),
      ...(password ? { password } : {}),
    };

    onSave(payload);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-40 p-2">
      <div className="w-full max-w-lg bg-gradient-to-b from-gray-900 to-neutral-900 rounded-xl p-6 overflow-auto max-h-[90vh]">
        <h4 className="text-lg font-semibold mb-4">
          {initial.id ? 'Editar Usuário' : 'Novo Usuário'}
        </h4>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm text-gray-300">Nome</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="mt-1 block w-full rounded bg-black/30 px-3 py-2"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 block w-full rounded bg-black/30 px-3 py-2"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-300">
              Senha {initial.id ? '(Deixe em branco para manter)' : ''}
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 block w-full rounded bg-black/30 px-3 py-2"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
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
  );
}
