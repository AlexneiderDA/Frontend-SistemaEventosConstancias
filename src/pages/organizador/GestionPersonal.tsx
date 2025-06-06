"use client"

import type React from "react"
import { useState } from "react"

interface Auditor {
  id: number
  name: string
  email: string
  phone: string
  assignedEvents: string[]
  status: "active" | "inactive"
  lastActivity: string
  totalEvents: number
}

export const GestionPersonal: React.FC = () => {
  const [auditors, setAuditors] = useState<Auditor[]>([
    {
      id: 1,
      name: "Ana Martínez",
      email: "ana.martinez@email.com",
      phone: "+1234567890",
      assignedEvents: ["Conferencia de Tecnología 2024", "Workshop de Desarrollo Web"],
      status: "active",
      lastActivity: "2024-12-10T14:30:00",
      totalEvents: 15,
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@email.com",
      phone: "+1234567891",
      assignedEvents: ["Seminario de IA"],
      status: "active",
      lastActivity: "2024-12-09T16:45:00",
      totalEvents: 8,
    },
    {
      id: 3,
      name: "Laura González",
      email: "laura.gonzalez@email.com",
      phone: "+1234567892",
      assignedEvents: [],
      status: "inactive",
      lastActivity: "2024-12-05T10:20:00",
      totalEvents: 22,
    },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [selectedAuditors, setSelectedAuditors] = useState<number[]>([])
  const [newAuditor, setNewAuditor] = useState({
    name: "",
    email: "",
    phone: "",
    events: [] as string[],
  })

  const availableEvents = [
    "Conferencia de Tecnología 2024",
    "Workshop de Desarrollo Web",
    "Seminario de IA",
    "Curso de React Avanzado",
  ]

  const handleSelectAuditor = (id: number) => {
    setSelectedAuditors((prev) => (prev.includes(id) ? prev.filter((auditorId) => auditorId !== id) : [...prev, id]))
  }

  const handleSelectAll = () => {
    if (selectedAuditors.length === auditors.length) {
      setSelectedAuditors([])
    } else {
      setSelectedAuditors(auditors.map((a) => a.id))
    }
  }

  const addAuditor = () => {
    const newId = Math.max(...auditors.map((a) => a.id)) + 1
    const auditor: Auditor = {
      id: newId,
      name: newAuditor.name,
      email: newAuditor.email,
      phone: newAuditor.phone,
      assignedEvents: newAuditor.events,
      status: "active",
      lastActivity: new Date().toISOString(),
      totalEvents: 0,
    }

    setAuditors((prev) => [...prev, auditor])
    setNewAuditor({ name: "", email: "", phone: "", events: [] })
    setShowAddModal(false)
  }

  const removeAuditor = (id: number) => {
    setAuditors((prev) => prev.filter((a) => a.id !== id))
  }

  const toggleAuditorStatus = (id: number) => {
    setAuditors((prev) =>
      prev.map((auditor) =>
        auditor.id === id ? { ...auditor, status: auditor.status === "active" ? "inactive" : "active" } : auditor,
      ),
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Personal de Apoyo</h1>
            <p className="text-gray-600 mt-2">Administra los auditores asignados a tus eventos</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowNotificationModal(true)}
              disabled={selectedAuditors.length === 0}
              className="px-4 py-2 bg-[#38A2C1] text-white rounded-lg hover:bg-[#67DCD7] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              📧 Notificar Seleccionados
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#1C8443] text-white rounded-lg hover:bg-[#41AD49] transition-colors"
            >
              ➕ Agregar Auditor
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-[#1C8443]">{auditors.length}</div>
            <div className="text-sm text-gray-600">Total Auditores</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-[#41AD49]">
              {auditors.filter((a) => a.status === "active").length}
            </div>
            <div className="text-sm text-gray-600">Activos</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-[#38A2C1]">
              {auditors.reduce((sum, a) => sum + a.assignedEvents.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Asignaciones Totales</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-[#8DC642]">
              {Math.round(auditors.reduce((sum, a) => sum + a.totalEvents, 0) / auditors.length)}
            </div>
            <div className="text-sm text-gray-600">Promedio Eventos</div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedAuditors.length > 0 && (
          <div className="bg-[#1C8443] text-white rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span>{selectedAuditors.length} auditor(es) seleccionado(s)</span>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowNotificationModal(true)}
                  className="px-4 py-2 bg-white text-[#1C8443] rounded-lg hover:bg-gray-100 transition-colors"
                >
                  📧 Enviar Notificación
                </button>
                <button className="px-4 py-2 bg-white text-[#1C8443] rounded-lg hover:bg-gray-100 transition-colors">
                  📋 Asignar Eventos
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Auditors Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedAuditors.length === auditors.length && auditors.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-[#1C8443] focus:ring-[#1C8443]"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Auditor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Eventos Asignados
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Actividad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auditors.map((auditor) => (
                  <tr key={auditor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedAuditors.includes(auditor.id)}
                        onChange={() => handleSelectAuditor(auditor.id)}
                        className="rounded border-gray-300 text-[#1C8443] focus:ring-[#1C8443]"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-[#1C8443] rounded-full flex items-center justify-center text-white font-medium">
                          {auditor.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{auditor.name}</div>
                          <div className="text-sm text-gray-500">{auditor.totalEvents} eventos totales</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{auditor.email}</div>
                      <div className="text-sm text-gray-500">{auditor.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {auditor.assignedEvents.length > 0 ? (
                          auditor.assignedEvents.map((event, index) => (
                            <div key={index} className="text-sm text-gray-900 bg-gray-100 px-2 py-1 rounded">
                              {event}
                            </div>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500 italic">Sin asignaciones</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          auditor.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {auditor.status === "active" ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(auditor.lastActivity).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => toggleAuditorStatus(auditor.id)}
                        className={`${
                          auditor.status === "active"
                            ? "text-red-600 hover:text-red-800"
                            : "text-green-600 hover:text-green-800"
                        }`}
                      >
                        {auditor.status === "active" ? "⏸️ Desactivar" : "▶️ Activar"}
                      </button>
                      <button className="text-[#38A2C1] hover:text-[#67DCD7]">📧 Notificar</button>
                      <button onClick={() => removeAuditor(auditor.id)} className="text-red-600 hover:text-red-800">
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Auditor Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nuevo Auditor</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    value={newAuditor.name}
                    onChange={(e) => setNewAuditor((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
                    placeholder="Nombre completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newAuditor.email}
                    onChange={(e) => setNewAuditor((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
                    placeholder="email@ejemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={newAuditor.phone}
                    onChange={(e) => setNewAuditor((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
                    placeholder="+1234567890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Eventos a Asignar</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {availableEvents.map((event) => (
                      <label key={event} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newAuditor.events.includes(event)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewAuditor((prev) => ({ ...prev, events: [...prev.events, event] }))
                            } else {
                              setNewAuditor((prev) => ({ ...prev, events: prev.events.filter((e) => e !== event) }))
                            }
                          }}
                          className="mr-2 text-[#1C8443] focus:ring-[#1C8443]"
                        />
                        <span className="text-sm">{event}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={addAuditor}
                    disabled={!newAuditor.name || !newAuditor.email}
                    className="px-4 py-2 bg-[#1C8443] text-white rounded-lg hover:bg-[#41AD49] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    ➕ Agregar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Modal */}
        {showNotificationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Enviar Notificación</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asunto</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
                    placeholder="Asunto de la notificación"
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
                <div className="text-sm text-gray-600">
                  Se enviará a {selectedAuditors.length} auditor(es) seleccionado(s)
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowNotificationModal(false)}
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
