"use client"

import type React from "react"
import { Search, Filter } from "lucide-react"

interface FiltrosProps {
  busqueda: string
  setBusqueda: (value: string) => void
  categoriaSeleccionada: string
  setCategoriaSeleccionada: (value: string) => void
  categorias: string[]
}

const Filtros: React.FC<FiltrosProps> = ({
  busqueda,
  setBusqueda,
  categoriaSeleccionada,
  setCategoriaSeleccionada,
  categorias,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67DCD7]"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter size={18} className="text-[#1C8443]" />
          <select
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#67DCD7]"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((categoria, index) => (
              <option key={index} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default Filtros
