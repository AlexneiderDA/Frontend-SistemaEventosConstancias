"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react"

interface EventoRegistrado {
  id: number
  titulo: string
  fecha: string
  horario: string
  lugar: string
  imagen: string
}

const AccesosRapidos = () => {
  const [eventosRegistrados, setEventosRegistrados] = useState<EventoRegistrado[]>([])

  // Simular carga de datos
  useEffect(() => {
    // En un caso real, aquí harías una llamada a tu API
    const eventosData: EventoRegistrado[] = [
      {
        id: 1,
        titulo: "Conferencia de Inteligencia Artificial",
        fecha: "15 de Mayo, 2025",
        horario: "10:00 - 13:00",
        lugar: "Auditorio Principal, Edificio A",
        imagen: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 2,
        titulo: "Taller de Desarrollo Web con React",
        fecha: "20 de Mayo, 2025",
        horario: "15:00 - 18:00",
        lugar: "Laboratorio de Cómputo, Edificio B",
        imagen: "/placeholder.svg?height=100&width=100",
      },
    ]

    setEventosRegistrados(eventosData)
  }, [])

  if (eventosRegistrados.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-[#1C8443] mb-4">Mis Eventos</h2>
        <div className="text-center py-6 text-gray-500">
          <p>No te has registrado a ningún evento todavía</p>
          <a
            href="/eventos"
            className="mt-3 inline-block bg-[#8DC642] hover:bg-[#41AD49] text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Explorar eventos
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#1C8443]">Mis Eventos</h2>
        <a href="/mis-eventos" className="text-sm text-[#38A2C1] hover:text-[#1C8443] font-medium flex items-center">
          Ver todos <ArrowRight size={16} className="ml-1" />
        </a>
      </div>

      <div className="space-y-4">
        {eventosRegistrados.map((evento) => (
          <div key={evento.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
            <img
              src={evento.imagen || "/placeholder.svg"}
              alt={evento.titulo}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#1C8443] truncate">{evento.titulo}</h3>
              <div className="mt-1 space-y-1 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1 text-[#41AD49]" />
                  <span>{evento.fecha}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={14} className="mr-1 text-[#41AD49]" />
                  <span>{evento.horario}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={14} className="mr-1 text-[#41AD49]" />
                  <span className="truncate">{evento.lugar}</span>
                </div>
              </div>
            </div>
            <a
              href={`/eventos/${evento.id}`}
              className="shrink-0 bg-[#67DCD7] hover:bg-[#38A2C1] text-white p-2 rounded-full transition-colors"
              aria-label={`Ver detalles de ${evento.titulo}`}
            >
              <ArrowRight size={18} />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AccesosRapidos
