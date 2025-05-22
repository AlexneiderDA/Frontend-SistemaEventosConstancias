"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"

const Buscador = () => {
  const [busqueda, setBusqueda] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Redirigir a la página de eventos con el parámetro de búsqueda
    window.location.href = `/eventos?busqueda=${encodeURIComponent(busqueda)}`
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-[#1C8443] mb-4">Buscar Eventos</h2>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="¿Qué evento estás buscando?"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67DCD7]"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <button
          type="submit"
          className="bg-[#38A2C1] hover:bg-[#1C8443] text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Buscar
        </button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        <p className="text-sm text-gray-500 mr-2">Búsquedas populares:</p>
        {["Talleres", "Conferencias", "Cursos", "Hackathon"].map((tag) => (
          <a
            key={tag}
            href={`/eventos?busqueda=${encodeURIComponent(tag)}`}
            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
          >
            {tag}
          </a>
        ))}
      </div>
    </div>
  )
}

export default Buscador
