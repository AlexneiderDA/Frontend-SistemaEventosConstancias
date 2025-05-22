"use client"

import type React from "react"

type EstadoEvento = "todos" | "proximo" | "en-curso" | "finalizado"

interface FiltroEventosProps {
  onFiltroChange: (filtro: EstadoEvento) => void
  filtroActual: EstadoEvento
  contadores: {
    todos: number
    proximo: number
    "en-curso": number
    finalizado: number
  }
}

const FiltroEventos: React.FC<FiltroEventosProps> = ({ onFiltroChange, filtroActual, contadores }) => {
  const filtros: { valor: EstadoEvento; etiqueta: string; color: string }[] = [
    { valor: "todos", etiqueta: "Todos", color: "bg-gray-500" },
    { valor: "proximo", etiqueta: "Próximos", color: "bg-[#38A2C1]" },
    { valor: "en-curso", etiqueta: "En curso", color: "bg-[#41AD49]" },
    { valor: "finalizado", etiqueta: "Finalizados", color: "bg-[#8DC642]" },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {filtros.map((filtro) => (
          <button
            key={filtro.valor}
            onClick={() => onFiltroChange(filtro.valor)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
              filtroActual === filtro.valor ? "bg-[#1C8443] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${filtro.color} mr-2`}></span>
            {filtro.etiqueta}
            <span className="ml-2 bg-white/20 text-xs px-2 py-0.5 rounded-full">{contadores[filtro.valor]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default FiltroEventos
