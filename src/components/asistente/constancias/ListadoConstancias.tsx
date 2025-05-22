"use client"

import type React from "react"
import { useState } from "react"
import { Award, Calendar, Download, Eye, CheckCircle, XCircle, Search } from "lucide-react"

interface Constancia {
  id: string
  titulo: string
  evento: string
  fecha: string
  estado: "disponible" | "pendiente" | "expirada"
  fechaEmision?: string
  imagen: string
}

interface ListadoConstanciasProps {
  constancias: Constancia[]
  constanciaSeleccionada: string | null
  onSeleccionarConstancia: (id: string) => void
}

const ListadoConstancias: React.FC<ListadoConstanciasProps> = ({
  constancias,
  constanciaSeleccionada,
  onSeleccionarConstancia,
}) => {
  const [busqueda, setBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState<"todos" | "disponible" | "pendiente" | "expirada">("todos")

  // Filtrar constancias según búsqueda y filtro de estado
  const constanciasFiltradas = constancias.filter((constancia) => {
    const coincideBusqueda =
      constancia.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      constancia.evento.toLowerCase().includes(busqueda.toLowerCase())

    const coincideEstado = filtroEstado === "todos" || constancia.estado === filtroEstado

    return coincideBusqueda && coincideEstado
  })

  // Obtener el color y texto según el estado
  const getEstadoInfo = (estado: string) => {
    switch (estado) {
      case "disponible":
        return {
          color: "text-[#41AD49]",
          bgColor: "bg-[#41AD49]/10",
          icon: <CheckCircle size={16} className="text-[#41AD49]" />,
          texto: "Disponible",
        }
      case "pendiente":
        return {
          color: "text-[#38A2C1]",
          bgColor: "bg-[#38A2C1]/10",
          icon: <Calendar size={16} className="text-[#38A2C1]" />,
          texto: "Pendiente",
        }
      case "expirada":
        return {
          color: "text-gray-500",
          bgColor: "bg-gray-100",
          icon: <XCircle size={16} className="text-gray-500" />,
          texto: "Expirada",
        }
      default:
        return {
          color: "text-gray-500",
          bgColor: "bg-gray-100",
          icon: <XCircle size={16} className="text-gray-500" />,
          texto: "Desconocido",
        }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold text-[#1C8443] mb-4 flex items-center">
          <Award size={18} className="mr-2" /> Mis Constancias
        </h2>

        {/* Buscador y filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar constancias..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67DCD7]"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#67DCD7]"
          >
            <option value="todos">Todos los estados</option>
            <option value="disponible">Disponibles</option>
            <option value="pendiente">Pendientes</option>
            <option value="expirada">Expiradas</option>
          </select>
        </div>
      </div>

      {/* Lista de constancias */}
      <div className="max-h-[500px] overflow-y-auto">
        {constanciasFiltradas.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No se encontraron constancias que coincidan con tu búsqueda.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {constanciasFiltradas.map((constancia) => {
              const estadoInfo = getEstadoInfo(constancia.estado)
              const isSelected = constanciaSeleccionada === constancia.id

              return (
                <li
                  key={constancia.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    isSelected ? "bg-[#67DCD7]/10 border-l-4 border-[#1C8443]" : ""
                  }`}
                  onClick={() => constancia.estado === "disponible" && onSeleccionarConstancia(constancia.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Award size={24} className="text-[#8DC642]" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{constancia.titulo}</h3>
                      <p className="text-sm text-gray-500 mt-1">{constancia.evento}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-xs text-gray-500 mr-3">
                          <Calendar size={12} className="inline mr-1" /> {constancia.fecha}
                        </span>
                        <span
                          className={`text-xs ${estadoInfo.color} ${estadoInfo.bgColor} px-2 py-0.5 rounded-full flex items-center w-fit`}
                        >
                          {estadoInfo.icon}
                          <span className="ml-1">{estadoInfo.texto}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex gap-1">
                      {constancia.estado === "disponible" && (
                        <>
                          <button
                            className="p-1.5 text-gray-500 hover:text-[#38A2C1] hover:bg-gray-100 rounded-full transition-colors"
                            title="Ver constancia"
                            onClick={(e) => {
                              e.stopPropagation()
                              onSeleccionarConstancia(constancia.id)
                            }}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="p-1.5 text-gray-500 hover:text-[#41AD49] hover:bg-gray-100 rounded-full transition-colors"
                            title="Descargar constancia"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Download size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ListadoConstancias
