"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Navigation } from "lucide-react"

interface Ubicacion {
  direccion: string
  coordenadas: {
    lat: number
    lng: number
  }
  indicaciones: string
}

interface MapaUbicacionProps {
  ubicacion: Ubicacion
}

const MapaUbicacion: React.FC<MapaUbicacionProps> = ({ ubicacion }) => {
  const [mostrarIndicaciones, setMostrarIndicaciones] = useState(false)

  const abrirEnGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${ubicacion.coordenadas.lat},${ubicacion.coordenadas.lng}`
    window.open(url, "_blank")
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-[#1C8443] mb-4 flex items-center">
        <MapPin size={20} className="mr-2" /> Ubicación
      </h2>

      {/* Mapa simulado */}
      <div
        className="h-48 bg-gray-200 rounded-lg mb-4 relative overflow-hidden cursor-pointer"
        onClick={abrirEnGoogleMaps}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={`/placeholder.svg?height=200&width=400&text=Mapa`}
            alt="Mapa de ubicación"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/80 px-3 py-2 rounded-lg text-sm">Click para abrir en Google Maps</div>
          </div>
        </div>
      </div>

      {/* Dirección */}
      <p className="text-gray-700 mb-3">{ubicacion.direccion}</p>

      {/* Botones */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={abrirEnGoogleMaps}
          className="flex-1 bg-[#38A2C1] hover:bg-[#1C8443] text-white font-medium py-2 px-3 rounded-lg flex items-center justify-center transition-colors text-sm"
        >
          <Navigation size={16} className="mr-1" /> Cómo llegar
        </button>
        <button
          onClick={() => setMostrarIndicaciones(!mostrarIndicaciones)}
          className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-2 px-3 rounded-lg transition-colors text-sm"
        >
          {mostrarIndicaciones ? "Ocultar indicaciones" : "Ver indicaciones"}
        </button>
      </div>

      {/* Indicaciones */}
      {mostrarIndicaciones && (
        <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
          <p>{ubicacion.indicaciones}</p>
        </div>
      )}
    </div>
  )
}

export default MapaUbicacion
