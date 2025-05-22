"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Layout from "../../components/asistente/layout/Layout"
import ListadoConstancias from "../../components/asistente/constancias/ListadoConstancias"
import VisorConstancia from "../../components/asistente/constancias/VisorConstancia"
import VerificadorAutenticidad from "../../components/asistente/constancias/VerificadorAutenticidad"
import HistorialConstancias from "../../components/asistente/constancias/HistorialConstancias"

interface Constancia {
  id: string
  titulo: string
  evento: string
  fecha: string
  estado: "disponible" | "pendiente" | "expirada"
  fechaEmision?: string
  imagen: string
  folio?: string
  participante?: string
  tipoParticipacion?: string
  duracion?: string
  firmas?: {
    nombre: string
    cargo: string
  }[]
}

const MisConstanciasPage: React.FC = () => {
  const [constancias, setConstancias] = useState<Constancia[]>([])
  const [constanciaSeleccionada, setConstanciaSeleccionada] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)

  // Simular carga de datos
  useEffect(() => {
    // En un caso real, aquí harías una llamada a tu API
    setTimeout(() => {
      const constanciasData: Constancia[] = [
        {
          id: "1",
          titulo: "Constancia de Participación",
          evento: "Conferencia de Inteligencia Artificial",
          fecha: "15 de Mayo, 2025",
          estado: "disponible",
          fechaEmision: "20 de Mayo, 2025",
          imagen: "/placeholder.svg?height=600&width=800&text=Constancia-IA",
          folio: "DACYTI-2025-001234",
          participante: "Juan Pérez",
          tipoParticipacion: "Asistente",
          duracion: "5 horas",
        },
        {
          id: "2",
          titulo: "Constancia de Participación",
          evento: "Taller de Desarrollo Web con React",
          fecha: "20 de Mayo, 2025",
          estado: "pendiente",
          imagen: "/placeholder.svg?height=600&width=800&text=Constancia-React",
        },
        {
          id: "3",
          titulo: "Constancia de Ponente",
          evento: "Seminario de Ciberseguridad",
          fecha: "5 de Abril, 2025",
          estado: "disponible",
          fechaEmision: "10 de Abril, 2025",
          imagen: "/placeholder.svg?height=600&width=800&text=Constancia-Ciber",
          folio: "DACYTI-2025-000987",
          participante: "Juan Pérez",
          tipoParticipacion: "Ponente",
          duracion: "3 horas",
        },
        {
          id: "4",
          titulo: "Constancia de Asistencia",
          evento: "Curso de Ciencia de Datos con Python",
          fecha: "15 de Marzo, 2025",
          estado: "expirada",
          fechaEmision: "20 de Marzo, 2025",
          imagen: "/placeholder.svg?height=600&width=800&text=Constancia-Python",
          folio: "DACYTI-2025-000765",
          participante: "Juan Pérez",
          tipoParticipacion: "Asistente",
          duracion: "12 horas",
        },
      ]

      setConstancias(constanciasData)
      setCargando(false)
    }, 1000) // Simular tiempo de carga
  }, [])

  // Obtener la constancia seleccionada
  const constanciaActual = constancias.find((c) => c.id === constanciaSeleccionada) || null

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
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#1C8443] mb-2">Mis Constancias</h1>
          <p className="text-gray-600">Visualiza, descarga y verifica tus constancias de participación en eventos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Listado de constancias */}
          <div className="lg:col-span-1">
            <ListadoConstancias
              constancias={constancias}
              constanciaSeleccionada={constanciaSeleccionada}
              onSeleccionarConstancia={setConstanciaSeleccionada}
            />
          </div>

          {/* Columna derecha - Visor y herramientas */}
          <div className="lg:col-span-2 space-y-6">
            {/* Visor de constancia */}
            <VisorConstancia constancia={constanciaActual} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Verificador de autenticidad */}
              <VerificadorAutenticidad />

              {/* Historial de constancias */}
              <HistorialConstancias />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MisConstanciasPage
