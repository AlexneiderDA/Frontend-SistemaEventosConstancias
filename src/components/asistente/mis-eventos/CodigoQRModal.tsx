"use client"

import type React from "react"
import { X } from "lucide-react"

interface CodigoQRModalProps {
  isOpen: boolean
  onClose: () => void
  evento: {
    id: number
    titulo: string
    fecha: string
    qrCode: string
  }
}

const CodigoQRModal: React.FC<CodigoQRModalProps> = ({ isOpen, onClose, evento }) => {
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

        <h3 className="text-xl font-bold text-[#1C8443] mb-4 pr-6">Código QR de Asistencia</h3>
        <p className="text-gray-600 mb-4">
          Presenta este código QR al personal del evento para registrar tu asistencia.
        </p>

        <div className="flex flex-col items-center">
          <div className="bg-white p-3 rounded-lg shadow-md mb-4">
            <img src={evento.qrCode || "/placeholder.svg"} alt="Código QR" className="w-64 h-64" />
          </div>

          <div className="text-center">
            <h4 className="font-semibold text-gray-800">{evento.titulo}</h4>
            <p className="text-sm text-gray-600">{evento.fecha}</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="bg-[#38A2C1] hover:bg-[#1C8443] text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default CodigoQRModal
