"use client"

import type React from "react"
import { useState } from "react"
import { Download, Share2, CheckCircle2, Info } from "lucide-react"

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

interface VisorConstanciaProps {
  constancia: Constancia | null
}

const VisorConstancia: React.FC<VisorConstanciaProps> = ({ constancia }) => {
  const [mostrarInfo, setMostrarInfo] = useState(false)

  if (!constancia) {
    return (
      <div className="bg-white rounded-lg shadow-md h-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
            <CheckCircle2 size={40} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Selecciona una constancia</h3>
          <p className="text-gray-500 max-w-md">
            Selecciona una constancia del listado para previsualizarla y acceder a las opciones de descarga.
          </p>
        </div>
      </div>
    )
  }

  const handleDescargar = () => {
    // En un caso real, aquí implementarías la descarga del PDF
    alert("Descargando constancia en PDF...")
  }

  const handleCompartir = () => {
    // Implementación básica para compartir
    if (navigator.share) {
      navigator
        .share({
          title: constancia.titulo,
          text: `Mi constancia de ${constancia.evento}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error compartiendo:", error))
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("¡Enlace copiado al portapapeles!")
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold text-[#1C8443]">Previsualización</h2>
        <div className="flex gap-2">
          <button
            onClick={handleDescargar}
            className="bg-[#41AD49] hover:bg-[#1C8443] text-white p-2 rounded-lg transition-colors flex items-center"
            title="Descargar PDF"
          >
            <Download size={18} />
            <span className="ml-1 hidden sm:inline">Descargar PDF</span>
          </button>
          <button
            onClick={handleCompartir}
            className="bg-[#38A2C1] hover:bg-[#1C8443] text-white p-2 rounded-lg transition-colors"
            title="Compartir"
          >
            <Share2 size={18} />
          </button>
          <button
            onClick={() => setMostrarInfo(!mostrarInfo)}
            className={`p-2 rounded-lg transition-colors ${
              mostrarInfo ? "bg-[#67DCD7] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            title="Información de autenticidad"
          >
            <Info size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Información de autenticidad */}
        {mostrarInfo && (
          <div className="bg-[#67DCD7]/10 p-4 border-b border-[#67DCD7]/20 animate-fade-in">
            <h3 className="text-[#1C8443] font-medium mb-2 flex items-center">
              <CheckCircle2 size={18} className="mr-2" /> Información de autenticidad
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Folio de verificación:</p>
                <p className="font-medium">{constancia.folio || "DACYTI-2025-001234"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Fecha de emisión:</p>
                <p className="font-medium">{constancia.fechaEmision || "10 de Mayo, 2025"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-500 mb-1">Verificar autenticidad:</p>
                <div className="flex items-center">
                  <span className="font-medium break-all">
                    https://constancias.dacyti.edu.mx/verificar/{constancia.folio || "DACYTI-2025-001234"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Visor de constancia */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-50">
          <div className="relative max-w-full max-h-full">
            <img
              src={constancia.imagen || "/placeholder.svg?height=600&width=800&text=Constancia"}
              alt={constancia.titulo}
              className="max-w-full max-h-[70vh] object-contain shadow-lg"
            />
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs text-gray-700 shadow">
              Vista previa
            </div>
          </div>
        </div>

        {/* Detalles de la constancia */}
        <div className="p-4 border-t bg-white">
          <h3 className="font-medium text-gray-900 mb-2">{constancia.titulo}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <span className="text-gray-500">Evento:</span> {constancia.evento}
            </div>
            <div>
              <span className="text-gray-500">Fecha:</span> {constancia.fecha}
            </div>
            <div>
              <span className="text-gray-500">Participante:</span> {constancia.participante || "Juan Pérez"}
            </div>
            <div>
              <span className="text-gray-500">Tipo de participación:</span>{" "}
              {constancia.tipoParticipacion || "Asistente"}
            </div>
            <div>
              <span className="text-gray-500">Duración:</span> {constancia.duracion || "5 horas"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VisorConstancia
