"use client"

import type React from "react"
import { Calendar } from "lucide-react"

interface EventosVaciosProps {
  filtro: string
  onReset: () => void
}

const EventosVacios: React.FC<EventosVaciosProps> = ({ filtro, onReset }) => {
  let mensaje = ""
  let submensaje = ""

  switch (filtro) {
    case "proximo":
      mensaje = "No tienes eventos próximos"
      submensaje = "Explora los eventos disponibles y regístrate para verlos aquí."
      break
    case "en-curso":
      mensaje = "No tienes eventos en curso"
      submensaje = "Los eventos que estén realizándose actualmente aparecerán aquí."
      break
    case "finalizado":
      mensaje = "No tienes eventos finalizados"
      submensaje = "Los eventos a los que hayas asistido aparecerán aquí una vez concluidos."
      break
    default:
      mensaje = "No tienes eventos registrados"
      submensaje = "Explora los eventos disponibles y regístrate para verlos aquí."
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="bg-gray-100 p-4 rounded-full">
          <Calendar size={40} className="text-gray-400" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-700 mb-2">{mensaje}</h3>
      <p className="text-gray-500 mb-6">{submensaje}</p>
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        {filtro !== "todos" && (
          <button
            onClick={onReset}
            className="bg-white border border-[#38A2C1] text-[#38A2C1] hover:bg-[#38A2C1] hover:text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Ver todos mis eventos
          </button>
        )}
        <a
          href="/eventos"
          className="bg-[#8DC642] hover:bg-[#41AD49] text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Explorar eventos
        </a>
      </div>
    </div>
  )
}

export default EventosVacios
