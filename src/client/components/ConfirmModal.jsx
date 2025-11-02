import React from 'react';

export default function ConfirmModal({ isOpen, title, message, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-40 p-2">
      <div className="w-full max-w-md bg-gradient-to-b from-gray-900 to-neutral-900 rounded-xl p-6 overflow-auto max-h-[90vh]">
        <h4 className="text-lg font-semibold mb-4">{title}</h4>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-2 flex-wrap">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded bg-white/5"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-gradient-to-r from-red-600 to-red-500"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
