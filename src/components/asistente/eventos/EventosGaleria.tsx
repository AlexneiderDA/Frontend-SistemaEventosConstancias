"use client"

import type React from "react"
import { useState, useEffect } from "react"
import EventoCard from "./EventoCard"
import Filtros from "./Filtros"

interface Evento {
  id: number
  titulo: string
  imagen: string
  fecha: string
  horario: string
  lugar: string
  categoria: string
}

const EventosGaleria: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("")
  const [categorias, setCategorias] = useState<string[]>([])

  // Simular carga de datos
  useEffect(() => {
    // En un caso real, aquí harías una llamada a tu API
    const eventosData: Evento[] = [
      {
        id: 1,
        titulo: "Conferencia de Inteligencia Artificial",
        imagen: "/placeholder.svg?height=300&width=500",
        fecha: "15 de Mayo, 2025",
        horario: "10:00 - 13:00",
        lugar: "Auditorio Principal, Edificio A",
        categoria: "Conferencia",
      },
      {
        id: 2,
        titulo: "Taller de Desarrollo Web con React",
        imagen: "/placeholder.svg?height=300&width=500",
        fecha: "20 de Mayo, 2025",
        horario: "15:00 - 18:00",
        lugar: "Laboratorio de Cómputo, Edificio B",
        categoria: "Taller",
      },
      {
        id: 3,
        titulo: "Seminario de Ciberseguridad",
        imagen: "/placeholder.svg?height=300&width=500",
        fecha: "25 de Mayo, 2025",
        horario: "09:00 - 14:00",
        lugar: "Sala de Conferencias, Edificio C",
        categoria: "Seminario",
      },
      {
        id: 4,
        titulo: "Hackathon: Soluciones Tecnológicas para el Cambio Climático",
        imagen: "/placeholder.svg?height=300&width=500",
        fecha: "1-2 de Junio, 2025",
        horario: "09:00 - 18:00",
        lugar: "Centro de Innovación Tecnológica",
        categoria: "Hackathon",
      },
      {
        id: 5,
        titulo: "Curso de Ciencia de Datos con Python",
        imagen: "/placeholder.svg?height=300&width=500",
        fecha: "10-12 de Junio, 2025",
        horario: "16:00 - 20:00",
        lugar: "Aula Virtual 3, Edificio D",
        categoria: "Curso",
      },
      {
        id: 6,
        titulo: "Foro de Emprendimiento Tecnológico",
        imagen: "/placeholder.svg?height=300&width=500",
        fecha: "18 de Junio, 2025",
        horario: "11:00 - 16:00",
        lugar: "Centro Cultural Universitario",
        categoria: "Foro",
      },
    ]

    setEventos(eventosData)

    // Extraer categorías únicas
    const categoriasUnicas = Array.from(new Set(eventosData.map((evento) => evento.categoria)))
    setCategorias(categoriasUnicas)
  }, [])

  // Filtrar eventos según búsqueda y categoría
  const eventosFiltrados = eventos.filter((evento) => {
    const coincideBusqueda =
      evento.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      evento.lugar.toLowerCase().includes(busqueda.toLowerCase())

    const coincideCategoria = categoriaSeleccionada === "" || evento.categoria === categoriaSeleccionada

    return coincideBusqueda && coincideCategoria
  })

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1C8443]">Eventos Disponibles</h2>
        <p className="text-gray-600">Explora los próximos eventos y regístrate para participar</p>
      </div>

      <Filtros
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        categoriaSeleccionada={categoriaSeleccionada}
        setCategoriaSeleccionada={setCategoriaSeleccionada}
        categorias={categorias}
      />

      {eventosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventosFiltrados.map((evento) => (
            <EventoCard key={evento.id} {...evento} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">No se encontraron eventos que coincidan con tu búsqueda.</p>
        </div>
      )}
    </div>
  )
}

export default EventosGaleria
