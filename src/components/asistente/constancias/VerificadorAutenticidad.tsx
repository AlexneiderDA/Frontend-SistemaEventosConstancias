"use client"

import type React from "react"
import { useState } from "react"
import { Search, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

const VerificadorAutenticidad: React.FC = () => {
  const [folio, setFolio] = useState("")
  const [resultado, setResultado] = useState<"valido" | "invalido" | "error" | null>(null)
  const [cargando, setCargando] = useState(false)
  const [datosConstancia, setDatosConstancia] = useState<any>(null)

  const verificarConstancia = (e: React.FormEvent) => {
    e.preventDefault()
    if (!folio.trim()) return

    setCargando(true)
    setResultado(null)

    // Simulación de verificación
    setTimeout(() => {
      setCargando(false)

      // Simulamos diferentes resultados según el folio ingresado
      if (folio.includes("VALIDO") || folio.includes("2025")) {
        setResultado("valido")
        setDatosConstancia({
          titulo: "Constancia de Participación",
          evento: "Conferencia de Inteligencia Artificial",
          participante: "Juan Pérez",
          fechaEmision: "10 de Mayo, 2025",
          fechaEvento: "15 de Mayo, 2025",
          emisor: "Comunidad DACYTI",
        })
      } else if (folio.includes("ERROR")) {
        setResultado("error")
        setDatosConstancia(null)
      } else {
        setResultado("invalido")
        setDatosConstancia(null)
      }
    }, 1500)
  }

  const getResultadoUI = () => {
    if (cargando) {
      return (
        <div className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1C8443] mr-3"></div>
          <span>Verificando constancia...</span>
        </div>
      )
    }

    if (!resultado) return null

    if (resultado === "error") {
      return (
        <div className="p-6 bg-yellow-50 border-l-4 border-yellow-400 flex items-start">
          <AlertTriangle size={24} className="text-yellow-500 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-yellow-800 mb-1">Error en la verificación</h3>
            <p className="text-yellow-700">
              No se pudo completar la verificación. Por favor, intenta nuevamente o contacta a soporte si el problema
              persiste.
            </p>
          </div>
        </div>
      )
    }

    if (resultado === "invalido") {
      return (
        <div className="p-6 bg-red-50 border-l-4 border-red-400 flex items-start">
          <XCircle size={24} className="text-red-500 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-red-800 mb-1">Constancia no válida</h3>
            <p className="text-red-700">
              El folio ingresado no corresponde a ninguna constancia emitida por nuestra institución. Verifica que el
              folio sea correcto.
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="p-6 bg-green-50 border-l-4 border-green-400">
        <div className="flex items-start mb-4">
          <CheckCircle size={24} className="text-green-500 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-green-800 mb-1">Constancia válida</h3>
            <p className="text-green-700">
              La constancia es auténtica y fue emitida por nuestra institución. A continuación se muestran los detalles:
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-green-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm mb-1">Título:</p>
              <p className="font-medium">{datosConstancia.titulo}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Evento:</p>
              <p className="font-medium">{datosConstancia.evento}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Participante:</p>
              <p className="font-medium">{datosConstancia.participante}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Fecha de emisión:</p>
              <p className="font-medium">{datosConstancia.fechaEmision}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Fecha del evento:</p>
              <p className="font-medium">{datosConstancia.fechaEvento}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Emisor:</p>
              <p className="font-medium">{datosConstancia.emisor}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold text-[#1C8443] mb-4">Verificador de Autenticidad</h2>
        <p className="text-gray-600 mb-4">
          Ingresa el folio de la constancia para verificar su autenticidad. Puedes encontrar el folio en la parte
          inferior de la constancia.
        </p>

        <form onSubmit={verificarConstancia} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Ingresa el folio de la constancia"
              value={folio}
              onChange={(e) => setFolio(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67DCD7]"
              disabled={cargando}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <button
            type="submit"
            disabled={cargando || !folio.trim()}
            className="bg-[#38A2C1] hover:bg-[#1C8443] text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-gray-300"
          >
            Verificar
          </button>
        </form>

        <div className="mt-2 text-xs text-gray-500">
          <span>Ejemplo de folio: DACYTI-2025-001234</span>
        </div>
      </div>

      <div>{getResultadoUI()}</div>
    </div>
  )
}

export default VerificadorAutenticidad
