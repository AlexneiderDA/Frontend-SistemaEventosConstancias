"use client"

import type React from "react"
import { useState } from "react"

interface Sesion {
  id: number
  titulo: string
  descripcion: string
  horario: string
  ponente: string
  cuposDisponibles: number
  requiereRegistro: boolean
}

interface SeleccionSesionesProps {
  sesiones: Sesion[]
  onSeleccionCambiada: (sesionesSeleccionadas: number[]) => void
}

const SeleccionSesiones: React.FC<SeleccionSesionesProps> = ({ sesiones, onSeleccionCambiada }) => {
  const [sesionesSeleccionadas, setSesionesSeleccionadas] = useState<number[]>([])

  const toggleSesion = (sesionId: number) => {
    setSesionesSeleccionadas((prevSeleccionadas) => {
      let nuevasSeleccionadas
      if (prevSeleccionadas.includes(sesionId)) {
        nuevasSeleccionadas = prevSeleccionadas.filter((id) => id !== sesionId)
      } else {
        nuevasSeleccionadas = [...prevSeleccionadas, sesionId]
      }
      onSeleccionCambiada(nuevasSeleccionadas)
      return nuevasSeleccionadas
    })
  }

  if (!sesiones || sesiones.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-[#1C8443] mb-4">Selección de Sesiones</h3>
      <p className="text-sm text-gray-600 mb-4">
        Este evento tiene sesiones que requieren registro específico. Selecciona las sesiones a las que deseas asistir:
      </p>

      <div className="space-y-3">
        {sesiones.map((sesion) => (
          <div
            key={sesion.id}
            className={`border rounded-lg p-4 transition-colors ${
              sesionesSeleccionadas.includes(sesion.id)
                ? "border-[#41AD49] bg-[#8DC642]/10"
                : "border-gray-200 hover:border-[#67DCD7]"
            }`}
          >
            <div className="flex items-start">
              <input
                type="checkbox"
                id={`sesion-${sesion.id}`}
                checked={sesionesSeleccionadas.includes(sesion.id)}
                onChange={() => toggleSesion(sesion.id)}
                className="mt-1 h-4 w-4 text-[#41AD49] focus:ring-[#8DC642] rounded"
                disabled={!sesion.requiereRegistro || sesion.cuposDisponibles <= 0}
              />
              <label htmlFor={`sesion-${sesion.id}`} className="ml-3 flex-1 cursor-pointer">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-800">{sesion.titulo}</span>
                  <span className="text-sm text-gray-500">{sesion.horario}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{sesion.descripcion}</p>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-gray-600">Ponente: {sesion.ponente}</span>
                  {sesion.requiereRegistro ? (
                    <span className={`${sesion.cuposDisponibles > 0 ? "text-[#41AD49]" : "text-red-500"} font-medium`}>
                      {sesion.cuposDisponibles > 0
                        ? `${sesion.cuposDisponibles} cupos disponibles`
                        : "Sin cupos disponibles"}
                    </span>
                  ) : (
                    <span className="text-gray-500">No requiere registro</span>
                  )}
                </div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SeleccionSesiones
