"use client"

import type React from "react"
import { useState } from "react"
import { Calendar, Clock, MapPin, QrCode, ExternalLink, XCircle } from "lucide-react"
import CodigoQRModal from "./CodigoQRModal"
import ConfirmacionCancelacion from "./ConfirmacionCancelacion"

interface EventoRegistradoProps {
  evento: {
    id: number
    titulo: string
    imagen: string
    fecha: string
    horario: string
    lugar: string
    estado: "proximo" | "en-curso" | "finalizado"
    qrCode: string
    fechaRegistro: string
  }
  onCancelarRegistro: (id: number) => void
}

const EventoRegistrado: React.FC<EventoRegistradoProps> = ({ evento, onCancelarRegistro }) => {
  const [modalQROpen, setModalQROpen] = useState(false)
  const [modalCancelacionOpen, setModalCancelacionOpen] = useState(false)

  const getEstadoColor = () => {
    switch (evento.estado) {
      case "proximo":
        return "bg-[#38A2C1]"
      case "en-curso":
        return "bg-[#41AD49]"
      case "finalizado":
        return "bg-[#8DC642]"
      default:
        return "bg-gray-500"
    }
  }

  const getEstadoTexto = () => {
    switch (evento.estado) {
      case "proximo":
        return "Próximo"
      case "en-curso":
        return "En curso"
      case "finalizado":
        return "Finalizado"
      default:
        return "Desconocido"
    }
  }

  const handleCancelarRegistro = () => {
    setModalCancelacionOpen(false)
    onCancelarRegistro(evento.id)
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Imagen del evento */}
          <div className="md:w-1/3 h-48 md:h-auto relative">
            <img src={evento.imagen || "/placeholder.svg"} alt={evento.titulo} className="w-full h-full object-cover" />
            <div
              className={`absolute top-3 left-3 ${getEstadoColor()} text-white text-xs font-bold px-2 py-1 rounded-full`}
            >
              {getEstadoTexto()}
            </div>
          </div>

          {/* Información del evento */}
          <div className="md:w-2/3 p-5">
            <div className="flex flex-col h-full">
              <div>
                <h3 className="text-xl font-bold text-[#1C8443] mb-3">{evento.titulo}</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-[#41AD49]" />
                    <span>{evento.fecha}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2 text-[#41AD49]" />
                    <span>{evento.horario}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2 text-[#41AD49]" />
                    <span>{evento.lugar}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-4">Registrado el {evento.fechaRegistro}</p>
              </div>

              {/* Código QR y acciones */}
              <div className="mt-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-lg mr-3">
                    <img src={evento.qrCode || "/placeholder.svg"} alt="Código QR" className="w-16 h-16" />
                  </div>
                  <button
                    onClick={() => setModalQROpen(true)}
                    className="flex items-center text-[#38A2C1] hover:text-[#1C8443]"
                  >
                    <QrCode size={16} className="mr-1" />
                    <span className="text-sm">Ver QR</span>
                  </button>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <a
                    href={`/eventos/${evento.id}`}
                    className="flex-1 sm:flex-initial flex items-center justify-center bg-[#67DCD7] hover:bg-[#38A2C1] text-white py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    <ExternalLink size={16} className="mr-1" />
                    Detalles
                  </a>
                  {evento.estado === "proximo" && (
                    <button
                      onClick={() => setModalCancelacionOpen(true)}
                      className="flex-1 sm:flex-initial flex items-center justify-center border border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      <XCircle size={16} className="mr-1" />
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para mostrar el código QR */}
      <CodigoQRModal
        isOpen={modalQROpen}
        onClose={() => setModalQROpen(false)}
        evento={{
          id: evento.id,
          titulo: evento.titulo,
          fecha: evento.fecha,
          qrCode: evento.qrCode,
        }}
      />

      {/* Modal para confirmar cancelación */}
      <ConfirmacionCancelacion
        isOpen={modalCancelacionOpen}
        onClose={() => setModalCancelacionOpen(false)}
        onConfirm={handleCancelarRegistro}
        evento={{
          titulo: evento.titulo,
          fecha: evento.fecha,
        }}
      />
    </>
  )
}

export default EventoRegistrado
