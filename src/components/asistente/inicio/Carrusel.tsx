"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Evento {
  id: number
  titulo: string
  imagen: string
  fecha: string
}

const Carrusel = () => {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Simular carga de datos
  useEffect(() => {
    // En un caso real, aquí harías una llamada a tu API
    const eventosDestacados: Evento[] = [
      {
        id: 1,
        titulo: "Conferencia de Inteligencia Artificial",
        imagen: "/placeholder.svg?height=400&width=800",
        fecha: "15 de Mayo, 2025",
      },
      {
        id: 2,
        titulo: "Taller de Desarrollo Web con React",
        imagen: "/placeholder.svg?height=400&width=800",
        fecha: "20 de Mayo, 2025",
      },
      {
        id: 3,
        titulo: "Seminario de Ciberseguridad",
        imagen: "/placeholder.svg?height=400&width=800",
        fecha: "25 de Mayo, 2025",
      },
    ]

    setEventos(eventosDestacados)
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === eventos.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? eventos.length - 1 : prevIndex - 1))
  }

  // Auto-avance del carrusel cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [eventos.length])

  if (eventos.length === 0) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Cargando eventos destacados...</p>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg h-64 md:h-80">
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {eventos.map((evento) => (
          <div key={evento.id} className="min-w-full h-full relative">
            <img src={evento.imagen || "/placeholder.svg"} alt={evento.titulo} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white text-xl md:text-2xl font-bold mb-2">{evento.titulo}</h3>
              <p className="text-white/90">{evento.fecha}</p>
              <a
                href={`/eventos/${evento.id}`}
                className="mt-3 inline-block bg-[#8DC642] hover:bg-[#41AD49] text-white font-medium py-2 px-4 rounded transition-colors w-fit"
              >
                Ver detalles
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Controles de navegación */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        aria-label="Anterior"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        aria-label="Siguiente"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {eventos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Carrusel
