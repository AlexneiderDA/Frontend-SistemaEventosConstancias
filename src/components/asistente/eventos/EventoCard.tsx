"use client"

import type React from "react"
import { Calendar, Clock, MapPin } from "lucide-react"

interface EventoCardProps {
  id: number
  titulo: string
  imagen: string
  fecha: string
  horario: string
  lugar: string
  categoria: string
}

const EventoCard: React.FC<EventoCardProps> = ({ id, titulo, imagen, fecha, horario, lugar, categoria }) => {
  // Función para navegar a la página de detalle
  const navegarADetalle = (e: React.MouseEvent<HTMLDivElement>) => {
    // Si el clic fue en el botón, no hacemos nada (el botón tiene su propio enlace)
    if ((e.target as HTMLElement).tagName === "A" || (e.target as HTMLElement).closest("a")) {
      return
    }

    // Navegar a la página de detalle
    window.location.href = `/eventos/${id}`
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={navegarADetalle}
    >
      <div className="relative h-48 overflow-hidden">
        <img src={imagen || "/placeholder.svg"} alt={titulo} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 bg-[#38A2C1] text-white text-xs font-bold px-2 py-1 rounded">
          {categoria}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-[#1C8443] mb-2 line-clamp-2">{titulo}</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar size={16} className="mr-2 text-[#41AD49]" />
            <span>{fecha}</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-2 text-[#41AD49]" />
            <span>{horario}</span>
          </div>
          <div className="flex items-center">
            <MapPin size={16} className="mr-2 text-[#41AD49]" />
            <span className="line-clamp-1">{lugar}</span>
          </div>
        </div>
        <div className="mt-4">
          <a
            href={`/eventos/${id}`}
            className="inline-block bg-[#8DC642] hover:bg-[#41AD49] text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Ver detalles
          </a>
        </div>
      </div>
    </div>
  )
}

export default EventoCard
