"use client"

import type React from "react"
import { useState } from "react"
import {OrganizadorLayout} from "../../components/organizador/OrganizadorLayout"


interface Event {
  id: number
  name: string
  type: string
  date: string
  location: string
  status: "active" | "upcoming" | "completed" | "cancelled"
  attendees: number
  capacity: number
  registrations: number
}

export const GestionEventos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const events: Event[] = [
    {
      id: 1,
      name: "Conferencia de Tecnología 2024",
      type: "Conferencia",
      date: "2024-12-15",
      location: "Auditorio Principal",
      status: "upcoming",
      attendees: 0,
      capacity: 100,
      registrations: 85,
    },
    {
      id: 2,
      name: "Workshop de Desarrollo Web",
      type: "Taller",
      date: "2024-12-18",
      location: "Sala A",
      status: "active",
      attendees: 45,
      capacity: 50,
      registrations: 48,
    },
    {
      id: 3,
      name: "Seminario de IA",
      type: "Seminario",
      date: "2024-12-10",
      location: "Sala B",
      status: "completed",
      attendees: 92,
      capacity: 100,
      registrations: 95,
    },
  ]

  const statusColors = {
    active: "bg-[#41AD49] text-white",
    upcoming: "bg-[#8DC642] text-white",
    completed: "bg-gray-500 text-white",
    cancelled: "bg-red-500 text-white",
  }

  const statusLabels = {
    active: "Activo",
    upcoming: "Próximo",
    completed: "Completado",
    cancelled: "Cancelado",
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || event.status === statusFilter
    const matchesType = typeFilter === "all" || event.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <OrganizadorLayout title="Gestion de Evento">
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Eventos</h1>
            <p className="text-gray-600 mt-2">Administra todos tus eventos desde aquí</p>
          </div>
          <button className="px-6 py-3 bg-[#1C8443] text-white rounded-lg hover:bg-[#41AD49] transition-colors font-medium">
            ➕ Crear Nuevo Evento
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="upcoming">Próximo</option>
                <option value="completed">Completado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
              >
                <option value="all">Todos los tipos</option>
                <option value="Conferencia">Conferencia</option>
                <option value="Taller">Taller</option>
                <option value="Seminario">Seminario</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-[#38A2C1] text-white rounded-lg hover:bg-[#67DCD7] transition-colors">
                📊 Exportar Lista
              </button>
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Evento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asistencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{event.name}</div>
                        <div className="text-sm text-gray-500">📍 {event.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(event.date).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[event.status]}`}>
                        {statusLabels[event.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {event.attendees}/{event.capacity} asistentes
                      </div>
                      <div className="text-sm text-gray-500">{event.registrations} registrados</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-[#41AD49] h-2 rounded-full"
                          style={{ width: `${(event.attendees / event.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-[#1C8443] hover:text-[#41AD49]">✏️ Editar</button>
                      <button className="text-[#38A2C1] hover:text-[#67DCD7]">📋 Duplicar</button>
                      <button className="text-[#8DC642] hover:text-[#41AD49]">👥 Asistentes</button>
                      <button className="text-red-600 hover:text-red-800">🗑️ Cancelar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-[#1C8443]">{filteredEvents.length}</div>
            <div className="text-sm text-gray-600">Eventos Mostrados</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-[#41AD49]">
              {filteredEvents.reduce((sum, event) => sum + event.registrations, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Registros</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-[#38A2C1]">
              {filteredEvents.reduce((sum, event) => sum + event.attendees, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Asistentes</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-[#8DC642]">
              {filteredEvents.reduce((sum, event) => sum + event.capacity, 0)}
            </div>
            <div className="text-sm text-gray-600">Capacidad Total</div>
          </div>
        </div>
      </div>
    </div>
    </OrganizadorLayout>
  )
}
