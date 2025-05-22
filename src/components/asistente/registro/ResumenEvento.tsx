import type React from "react"
import { Calendar, Clock, MapPin, Users } from "lucide-react"

interface ResumenEventoProps {
  evento: {
    id: number
    titulo: string
    imagen: string
    fecha: string
    horario: string
    lugar: string
    categoria: string
    cuposDisponibles: number
    cuposTotal: number
  }
}

const ResumenEvento: React.FC<ResumenEventoProps> = ({ evento }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-32 overflow-hidden">
        <img src={evento.imagen || "/placeholder.svg"} alt={evento.titulo} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 bg-[#38A2C1] text-white text-xs font-bold px-2 py-1 rounded">
          {evento.categoria}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-[#1C8443] mb-3">{evento.titulo}</h3>
        <div className="space-y-2 text-sm text-gray-600">
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
          <div className="flex items-center">
            <Users size={16} className="mr-2 text-[#41AD49]" />
            <span>
              Cupos disponibles: <strong>{evento.cuposDisponibles}</strong> de {evento.cuposTotal}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumenEvento
