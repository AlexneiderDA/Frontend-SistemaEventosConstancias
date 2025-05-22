"use client"

import type React from "react"
import { AlertTriangle, X } from "lucide-react"

interface ConfirmacionCancelacionProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  evento: {
    titulo: string
    fecha: string
  }
}

const ConfirmacionCancelacion: React.FC<ConfirmacionCancelacionProps> = ({ isOpen, onClose, onConfirm, evento }) => {
  if (!isOpen) return null

  // Prevenir que el clic dentro del modal cierre el modal
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-fade-in"
        onClick={handleModalClick}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>

        <div className="flex items-center mb-4">
          <div className="bg-red-100 p-2 rounded-full mr-3">
            <AlertTriangle size={24} className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Cancelar Registro</h3>
        </div>

        <p className="text-gray-600 mb-4">
          ¿Estás seguro de que deseas cancelar tu registro para el evento <strong>{evento.titulo}</strong> programado
          para el <strong>{evento.fecha}</strong>?
        </p>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-sm text-yellow-700">
            Esta acción no se puede deshacer. Si deseas asistir después de cancelar, deberás registrarte nuevamente y
            podría no haber cupos disponibles.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Confirmar Cancelación
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmacionCancelacion
