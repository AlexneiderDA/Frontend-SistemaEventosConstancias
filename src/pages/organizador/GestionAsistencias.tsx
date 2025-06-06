"use client"

import type React from "react"
import { useState } from "react"

interface Attendee {
  id: number
  name: string
  email: string
  phone: string
  registrationDate: string
  status: "registered" | "confirmed" | "attended" | "absent"
  event: string
  checkInTime?: string
}

export const GestionAsistentes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [eventFilter, setEventFilter] = useState("all")
  const [selectedAttendees, setSelectedAttendees] = useState<number[]>([])
  const [showCommunicationModal, setShowCommunicationModal] = useState(false)

  const attendees: Attendee[] = [
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan.perez@email.com",
      phone: "+1234567890",
      registrationDate: "2024-12-01",
      status: "attended",
      event: "Conferencia de Tecnología 2024",
      checkInTime: "09:15",
    },
    {
      id: 2,
      name: "María García",
      email: "maria.garcia@email.com",
      phone: "+1234567891",
      registrationDate: "2024-12-02",
      status: "confirmed",
      event: "Workshop de Desarrollo Web",
    },
    {
      id: 3,
      name: "Carlos López",
      email: "carlos.lopez@email.com",
      phone: "+1234567892",
      registrationDate: "2024-12-03",
      status: "registered",
      event: "Seminario de IA",
    },
  ]

  const events = ["Conferencia de Tecnología 2024", "Workshop de Desarrollo Web", "Seminario de IA"]

  const statusColors = {
    registered: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    attended: "bg-green-100 text-green-800",
    absent: "bg-red-100 text-red-800",
  }

  const statusLabels = {
    registered: "Registrado",
    confirmed: "Confirmado",
    attended: "Asistió",
    absent: "Ausente",
  }

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearch =
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || attendee.status === statusFilter
    const matchesEvent = eventFilter === "all" || attendee.event === eventFilter

    return matchesSearch && matchesStatus && matchesEvent
  })

  const handleSelectAll = () => {
    if (selectedAttendees.length === filteredAttendees.length) {
      setSelectedAttendees([])
    } else {
      setSelectedAttendees(filteredAttendees.map((a) => a.id))
    }
  }

  const handleSelectAttendee = (id: number) => {
    setSelectedAttendees((prev) => (prev.includes(id) ? prev.filter((attendeeId) => attendeeId !== id) : [...prev, id]))
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Asistentes</h1>
            <p className="text-gray-600 mt-2">Administra los participantes de tus eventos</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-[#38A2C1] text-white rounded-lg hover:bg-[#67DCD7] transition-colors">
              📧 Comunicaciones
            </button>
            <button className="px-4 py-2 bg-[#8DC642] text-white rounded-lg hover:bg-[#41AD49] transition-colors">
              📊 Exportar Lista
            </button>
            <button className="px-4 py-2 bg-[#1C8443] text-white rounded-lg hover:bg-[#41AD49] transition-colors">
              ➕ Agregar Asistente
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
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
                <option value="registered">Registrado</option>
                <option value="confirmed">Confirmado</option>
                <option value="attended">Asistió</option>
                <option value="absent">Ausente</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Evento</label>
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
              >
                <option value="all">Todos los eventos</option>
                {events.map((event) => (
                  <option key={event} value={event}>
                    {event}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-[#67DCD7] text-white rounded-lg hover:bg-[#38A2C1] transition-colors">
                🔍 Búsqueda Avanzada
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedAttendees.length > 0 && (
          <div className="bg-[#1C8443] text-white rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span>{selectedAttendees.length} asistente(s) seleccionado(s)</span>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCommunicationModal(true)}
                  className="px-4 py-2 bg-white text-[#1C8443] rounded-lg hover:bg-gray-100 transition-colors"
                >
                  📧 Enviar Comunicación
                </button>
                <button className="px-4 py-2 bg-white text-[#1C8443] rounded-lg hover:bg-gray-100 transition-colors">
                  🗑️ Eliminar Seleccionados
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Attendees Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedAttendees.length === filteredAttendees.length && filteredAttendees.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-[#1C8443] focus:ring-[#1C8443]"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asistente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Evento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendees.map((attendee) => (
                  <tr key={attendee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedAttendees.includes(attendee.id)}
                        onChange={() => handleSelectAttendee(attendee.id)}
                        className="rounded border-gray-300 text-[#1C8443] focus:ring-[#1C8443]"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-[#1C8443] rounded-full flex items-center justify-center text-white font-medium">
                          {attendee.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{attendee.name}</div>
                          {attendee.checkInTime && (
                            <div className="text-sm text-gray-500">Check-in: {attendee.checkInTime}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{attendee.email}</div>
                      <div className="text-sm text-gray-500">{attendee.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{attendee.event}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[attendee.status]}`}>
                        {statusLabels[attendee.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(attendee.registrationDate).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-[#1C8443] hover:text-[#41AD49]">✏️ Editar</button>
                      <button className="text-[#38A2C1] hover:text-[#67DCD7]">📧 Contactar</button>
                      <button className="text-red-600 hover:text-red-800">🗑️ Eliminar</button>
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
            <div className="text-2xl font-bold text-[#1C8443]">{filteredAttendees.length}</div>
            <div className="text-sm text-gray-600">Asistentes Mostrados</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-[#41AD49]">
              {filteredAttendees.filter((a) => a.status === "attended").length}
            </div>
            <div className="text-sm text-gray-600">Asistieron</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-[#38A2C1]">
              {filteredAttendees.filter((a) => a.status === "confirmed").length}
            </div>
            <div className="text-sm text-gray-600">Confirmados</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-[#8DC642]">
              {filteredAttendees.filter((a) => a.status === "registered").length}
            </div>
            <div className="text-sm text-gray-600">Registrados</div>
          </div>
        </div>

        {/* Communication Modal */}
        {showCommunicationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Enviar Comunicación</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asunto</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
                    placeholder="Asunto del mensaje"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
                    placeholder="Escribe tu mensaje aquí..."
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowCommunicationModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button className="px-4 py-2 bg-[#1C8443] text-white rounded-lg hover:bg-[#41AD49] transition-colors">
                    📧 Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
