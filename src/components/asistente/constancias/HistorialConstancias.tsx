"use client"

import type React from "react"
import { useState } from "react"
import { Download, Clock, CheckCircle, XCircle } from "lucide-react"

interface HistorialItem {
  id: string
  titulo: string
  evento: string
  fecha: string
  estado: "emitida" | "descargada" | "verificada" | "expirada"
  fechaAccion: string
}

const HistorialConstancias: React.FC = () => {
  const [historial, setHistorial] = useState<HistorialItem[]>([
    {
      id: "1",
      titulo: "Constancia de Participación",
      evento: "Conferencia de Inteligencia Artificial",
      fecha: "15 de Mayo, 2025",
      estado: "emitida",
      fechaAccion: "10 de Mayo, 2025 - 14:30",
    },
    {
      id: "2",
      titulo: "Constancia de Participación",
      evento: "Taller de Desarrollo Web con React",
      fecha: "20 de Mayo, 2025",
      estado: "descargada",
      fechaAccion: "21 de Mayo, 2025 - 09:15",
    },
    {
      id: "3",
      titulo: "Constancia de Ponente",
      evento: "Seminario de Ciberseguridad",
      fecha: "5 de Abril, 2025",
      estado: "verificada",
      fechaAccion: "12 de Abril, 2025 - 16:45",
    },
    {
      id: "4",
      titulo: "Constancia de Asistencia",
      evento: "Curso de Ciencia de Datos con Python",
      fecha: "15 de Marzo, 2025",
      estado: "expirada",
      fechaAccion: "20 de Marzo, 2025 - 11:20",
    },
  ])

  // Obtener el icono y color según el estado
  const getEstadoInfo = (estado: string) => {
    switch (estado) {
      case "emitida":
        return {
          icon: <CheckCircle size={16} className="text-[#41AD49]" />,
          color: "text-[#41AD49]",
          texto: "Emitida",
        }
      case "descargada":
        return {
          icon: <Download size={16} className="text-[#38A2C1]" />,
          color: "text-[#38A2C1]",
          texto: "Descargada",
        }
      case "verificada":
        return {
          icon: <CheckCircle size={16} className="text-[#8DC642]" />,
          color: "text-[#8DC642]",
          texto: "Verificada",
        }
      case "expirada":
        return {
          icon: <XCircle size={16} className="text-gray-500" />,
          color: "text-gray-500",
          texto: "Expirada",
        }
      default:
        return {
          icon: <Clock size={16} className="text-gray-500" />,
          color: "text-gray-500",
          texto: "Desconocido",
        }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold text-[#1C8443] mb-2">Historial de Actividad</h2>
        <p className="text-gray-600 text-sm">Registro de actividad relacionada con tus constancias.</p>
      </div>

      <div className="max-h-[300px] overflow-y-auto">
        {historial.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No hay actividad registrada.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {historial.map((item) => {
              const estadoInfo = getEstadoInfo(item.estado)

              return (
                <li key={item.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <div
                        className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ${estadoInfo.color}`}
                      >
                        {estadoInfo.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-900">Constancia {estadoInfo.texto.toLowerCase()}</p>
                        <span className="text-xs text-gray-500">{item.fechaAccion}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.titulo} - {item.evento}
                      </p>
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

export default HistorialConstancias
