"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, Users, FileText, Award, Share2 } from "lucide-react"
import ProgramaEvento from "./ProgramaEvento"
import MapaUbicacion from "./MapaUbicacion"

interface DetalleEventoProps {
  id: string | number
}

interface Evento {
  id: number
  titulo: string
  imagen: string
  fecha: string
  horario: string
  lugar: string
  categoria: string
  descripcion: string
  requisitos: string[]
  cuposTotal: number
  cuposDisponibles: number
  otorgaConstancia: boolean
  programa: {
    hora: string
    actividad: string
    ponente?: string
  }[]
  ubicacion: {
    direccion: string
    coordenadas: {
      lat: number
      lng: number
    }
    indicaciones: string
  }
}

const DetalleEvento: React.FC<DetalleEventoProps> = ({ id }) => {
  const [evento, setEvento] = useState<Evento | null>(null)
  const [cargando, setCargando] = useState(true)
  //const [registrado, setRegistrado] = useState(false)
  //const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)

  // Simular carga de datos
  useEffect(() => {
    // En un caso real, aquí harías una llamada a tu API con el ID
    setTimeout(() => {
      const eventoData: Evento = {
        id: Number(id),
        titulo: "Conferencia de Inteligencia Artificial",
        imagen: "/placeholder.svg?height=500&width=1200",
        fecha: "15 de Mayo, 2025",
        horario: "10:00 - 13:00",
        lugar: "Auditorio Principal, Edificio A",
        categoria: "Conferencia",
        descripcion:
          "Únete a nosotros para explorar las últimas tendencias y avances en Inteligencia Artificial. Esta conferencia está diseñada para estudiantes, profesionales y entusiastas que deseen profundizar en el mundo de la IA y sus aplicaciones prácticas en la industria actual. Contaremos con ponentes destacados del ámbito académico y empresarial que compartirán sus conocimientos y experiencias en este campo en constante evolución.",
        requisitos: [
          "Conocimientos básicos de programación",
          "Interés en el campo de la Inteligencia Artificial",
          "Laptop (opcional, para seguir demostraciones)",
        ],
        cuposTotal: 150,
        cuposDisponibles: 42,
        otorgaConstancia: true,
        programa: [
          {
            hora: "10:00 - 10:15",
            actividad: "Bienvenida e introducción",
            ponente: "Dr. Juan Pérez, Director DACYTI",
          },
          {
            hora: "10:15 - 11:00",
            actividad: "Fundamentos de Machine Learning aplicados a problemas reales",
            ponente: "Dra. María Rodríguez, Investigadora en IA",
          },
          {
            hora: "11:00 - 11:45",
            actividad: "Implementación de modelos de IA en empresas: casos de éxito",
            ponente: "Ing. Carlos Gómez, Tech Lead en AI Solutions",
          },
          {
            hora: "11:45 - 12:00",
            actividad: "Receso",
          },
          {
            hora: "12:00 - 12:45",
            actividad: "El futuro de la IA: tendencias y desafíos",
            ponente: "Dra. Ana López, Profesora de Ciencias Computacionales",
          },
          {
            hora: "12:45 - 13:00",
            actividad: "Sesión de preguntas y respuestas",
          },
        ],
        ubicacion: {
          direccion: "Av. Universidad 3000, Ciudad Universitaria, Coyoacán, 04510 Ciudad de México, CDMX",
          coordenadas: {
            lat: 19.324,
            lng: -99.179,
          },
          indicaciones:
            "El Auditorio Principal se encuentra en el primer piso del Edificio A. Puedes acceder por la entrada principal y seguir las señalizaciones.",
        },
      }

      setEvento(eventoData)
      setCargando(false)
    }, 1000) // Simular tiempo de carga
  }, [id])

  const handleRegistro = () => {
    // Redirigir a la página de registro
    window.location.href = `/eventos/${id}/registro`
  }

  const compartirEvento = () => {
    // Implementación básica para compartir
    if (navigator.share) {
      navigator
        .share({
          title: evento?.titulo,
          text: `Te invito a asistir a ${evento?.titulo}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error compartiendo:", error))
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("¡Enlace copiado al portapapeles!")
    }
  }

  if (cargando) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1C8443]"></div>
      </div>
    )
  }

  if (!evento) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-700">Evento no encontrado</h2>
        <p className="mt-2 text-gray-500">El evento que buscas no existe o ha sido eliminado.</p>
        <a
          href="/eventos"
          className="mt-4 inline-block bg-[#8DC642] hover:bg-[#41AD49] text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Ver todos los eventos
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Imagen principal */}
      <div className="relative h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden mb-6">
        <img src={evento.imagen || "/placeholder.svg"} alt={evento.titulo} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 bg-[#38A2C1] text-white text-sm font-bold px-3 py-1.5 rounded-full">
          {evento.categoria}
        </div>
      </div>

      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1C8443]">{evento.titulo}</h1>
          <div className="mt-3 space-y-2">
            <div className="flex items-center text-gray-700">
              <Calendar size={18} className="mr-2 text-[#41AD49]" />
              <span>{evento.fecha}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Clock size={18} className="mr-2 text-[#41AD49]" />
              <span>{evento.horario}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <MapPin size={18} className="mr-2 text-[#41AD49]" />
              <span>{evento.lugar}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* Contador de cupos */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-700 flex items-center">
                <Users size={18} className="mr-2 text-[#41AD49]" /> Cupos disponibles
              </span>
              <span className="font-bold text-[#1C8443]">
                {evento.cuposDisponibles}/{evento.cuposTotal}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-[#8DC642] h-2.5 rounded-full"
                style={{ width: `${(evento.cuposDisponibles / evento.cuposTotal) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2">
            <button
              onClick={handleRegistro}
              className="flex-1 bg-[#41AD49] hover:bg-[#1C8443] text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
            >
              Registrarme
            </button>
            <button
              onClick={compartirEvento}
              className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 p-2 rounded-lg"
              aria-label="Compartir evento"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Descripción */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-[#1C8443] mb-4">Descripción</h2>
            <p className="text-gray-700 whitespace-pre-line">{evento.descripcion}</p>
          </div>

          {/* Programa */}
          <ProgramaEvento programa={evento.programa} />

          {/* Requisitos */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-[#1C8443] mb-4">Requisitos</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {evento.requisitos.map((requisito, index) => (
                <li key={index}>{requisito}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Columna derecha (1/3) */}
        <div className="space-y-6">
          {/* Información sobre constancias */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-[#1C8443] mb-4 flex items-center">
              <Award size={20} className="mr-2" /> Constancia
            </h2>
            {evento.otorgaConstancia ? (
              <div>
                <p className="text-gray-700 mb-3">
                  Este evento otorga constancia de participación. Para obtenerla, debes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Asistir al evento completo</li>
                  <li>Registrar entrada y salida</li>
                  <li>Completar la encuesta de satisfacción</li>
                </ul>
                <div className="mt-4 p-3 bg-[#67DCD7]/20 rounded-lg">
                  <p className="text-sm text-gray-700">
                    Las constancias estarán disponibles para descarga 5 días hábiles después del evento.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-700">Este evento no otorga constancia de participación.</p>
            )}
          </div>

          {/* Mapa o indicaciones */}
          <MapaUbicacion ubicacion={evento.ubicacion} />

          {/* Información adicional */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-[#1C8443] mb-4 flex items-center">
              <FileText size={20} className="mr-2" /> Información adicional
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-medium">Organizador:</span> Comunidad DACYTI
              </p>
              <p>
                <span className="font-medium">Contacto:</span> eventos@dacyti.edu.mx
              </p>
              <p>
                <span className="font-medium">Modalidad:</span> Presencial
              </p>
              <p>
                <span className="font-medium">Costo:</span> Gratuito
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetalleEvento
