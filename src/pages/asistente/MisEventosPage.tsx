"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Layout from "../../components/asistente/layout/Layout"
import FiltroEventos from "../../components/asistente/mis-eventos/FiltroEventos"
import EventoRegistrado from "../../components/asistente/mis-eventos/EventoRegistrado"
import EventosVacios from "../../components/asistente/mis-eventos/EventosVacios"

type EstadoEvento = "todos" | "proximo" | "en-curso" | "finalizado"

interface Evento {
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

const MisEventosPage: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [filtroActual, setFiltroActual] = useState<EstadoEvento>("todos")
  const [cargando, setCargando] = useState(true)

  // Simular carga de datos
  useEffect(() => {
    // En un caso real, aquí harías una llamada a tu API
    setTimeout(() => {
      const eventosData: Evento[] = [
        {
          id: 1,
          titulo: "Conferencia de Inteligencia Artificial",
          imagen: "/placeholder.svg?height=300&width=500",
          fecha: "15 de Mayo, 2025",
          horario: "10:00 - 13:00",
          lugar: "Auditorio Principal, Edificio A",
          estado: "proximo",
          qrCode: "/placeholder.svg?height=200&width=200&text=QR-CONF-IA",
          fechaRegistro: "28 de Abril, 2025",
        },
        {
          id: 2,
          titulo: "Taller de Desarrollo Web con React",
          imagen: "/placeholder.svg?height=300&width=500",
          fecha: "20 de Mayo, 2025",
          horario: "15:00 - 18:00",
          lugar: "Laboratorio de Cómputo, Edificio B",
          estado: "proximo",
          qrCode: "/placeholder.svg?height=200&width=200&text=QR-TALLER-REACT",
          fechaRegistro: "1 de Mayo, 2025",
        },
        {
          id: 3,
          titulo: "Hackathon: Soluciones para el Cambio Climático",
          imagen: "/placeholder.svg?height=300&width=500",
          fecha: "10 de Mayo, 2025",
          horario: "09:00 - 18:00",
          lugar: "Centro de Innovación Tecnológica",
          estado: "en-curso",
          qrCode: "/placeholder.svg?height=200&width=200&text=QR-HACKATHON",
          fechaRegistro: "15 de Abril, 2025",
        },
        {
          id: 4,
          titulo: "Seminario de Ciberseguridad",
          imagen: "/placeholder.svg?height=300&width=500",
          fecha: "5 de Abril, 2025",
          horario: "09:00 - 14:00",
          lugar: "Sala de Conferencias, Edificio C",
          estado: "finalizado",
          qrCode: "/placeholder.svg?height=200&width=200&text=QR-SEMINARIO-CIBER",
          fechaRegistro: "20 de Marzo, 2025",
        },
        {
          id: 5,
          titulo: "Curso de Ciencia de Datos con Python",
          imagen: "/placeholder.svg?height=300&width=500",
          fecha: "15 de Marzo, 2025",
          horario: "16:00 - 20:00",
          lugar: "Aula Virtual 3, Edificio D",
          estado: "finalizado",
          qrCode: "/placeholder.svg?height=200&width=200&text=QR-CURSO-PYTHON",
          fechaRegistro: "1 de Marzo, 2025",
        },
      ]

      setEventos(eventosData)
      setCargando(false)
    }, 1000) // Simular tiempo de carga
  }, [])

  // Filtrar eventos según el filtro actual
  const eventosFiltrados = eventos.filter((evento) => {
    if (filtroActual === "todos") return true
    return evento.estado === filtroActual
  })

  // Calcular contadores para cada filtro
  const contadores = {
    todos: eventos.length,
    proximo: eventos.filter((e) => e.estado === "proximo").length,
    "en-curso": eventos.filter((e) => e.estado === "en-curso").length,
    finalizado: eventos.filter((e) => e.estado === "finalizado").length,
  }

  // Manejar cambio de filtro
  const handleFiltroChange = (filtro: EstadoEvento) => {
    setFiltroActual(filtro)
  }

  // Manejar cancelación de registro
  const handleCancelarRegistro = (id: number) => {
    // En un caso real, aquí enviarías una solicitud a tu API
    setEventos((prevEventos) => prevEventos.filter((evento) => evento.id !== id))
  }

  if (cargando) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1C8443]"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#1C8443] mb-2">Mis Eventos</h1>
          <p className="text-gray-600">Gestiona los eventos a los que te has registrado</p>
        </div>

        {/* Filtros */}
        <FiltroEventos onFiltroChange={handleFiltroChange} filtroActual={filtroActual} contadores={contadores} />

        {/* Lista de eventos */}
        {eventos.length === 0 ? (
          <EventosVacios filtro={filtroActual} onReset={() => setFiltroActual("todos")} />
        ) : eventosFiltrados.length === 0 ? (
          <EventosVacios filtro={filtroActual} onReset={() => setFiltroActual("todos")} />
        ) : (
          <div className="space-y-6">
            {eventosFiltrados.map((evento) => (
              <EventoRegistrado key={evento.id} evento={evento} onCancelarRegistro={handleCancelarRegistro} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default MisEventosPage
