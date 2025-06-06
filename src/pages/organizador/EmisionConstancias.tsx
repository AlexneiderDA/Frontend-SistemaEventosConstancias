"use client"

import type React from "react"
import { useState } from "react"

interface Attendee {
  id: number
  name: string
  email: string
  event: string
  attendancePercentage: number
  isEligible: boolean
  certificateIssued: boolean
  issueDate?: string
}

interface Template {
  id: number
  name: string
  description: string
  preview: string
}

export const EmisionConstancias: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState("all")
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [selectedAttendees, setSelectedAttendees] = useState<number[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [filterEligible, setFilterEligible] = useState(true)

  const attendees: Attendee[] = [
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan.perez@email.com",
      event: "Conferencia de Tecnología 2024",
      attendancePercentage: 95,
      isEligible: true,
      certificateIssued: false,
    },
    {
      id: 2,
      name: "María García",
      email: "maria.garcia@email.com",
      event: "Workshop de Desarrollo Web",
      attendancePercentage: 88,
      isEligible: true,
      certificateIssued: true,
      issueDate: "2024-12-08",
    },
    {
      id: 3,
      name: "Carlos López",
      email: "carlos.lopez@email.com",
      event: "Seminario de IA",
      attendancePercentage: 65,
      isEligible: false,
      certificateIssued: false,
    },
    {
      id: 4,
      name: "Ana Martínez",
      email: "ana.martinez@email.com",
      event: "Conferencia de Tecnología 2024",
      attendancePercentage: 92,
      isEligible: true,
      certificateIssued: false,
    },
  ]

  const templates: Template[] = [
    {
      id: 1,
      name: "Plantilla Estándar",
      description: "Diseño clásico con logo institucional",
      preview: "📜 Plantilla con bordes elegantes y logo",
    },
    {
      id: 2,
      name: "Plantilla Moderna",
      description: "Diseño contemporáneo con colores vibrantes",
      preview: "🎨 Plantilla con diseño moderno y colorido",
    },
    {
      id: 3,
      name: "Plantilla Minimalista",
      description: "Diseño limpio y simple",
      preview: "⚪ Plantilla con diseño minimalista",
    },
  ]

  const events = [
    "Todos los eventos",
    "Conferencia de Tecnología 2024",
    "Workshop de Desarrollo Web",
    "Seminario de IA",
  ]

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesEvent = selectedEvent === "all" || attendee.event === selectedEvent
    const matchesEligibility = !filterEligible || attendee.isEligible
    return matchesEvent && matchesEligibility
  })

  const handleSelectAttendee = (id: number) => {
    setSelectedAttendees((prev) => (prev.includes(id) ? prev.filter((attendeeId) => attendeeId !== id) : [...prev, id]))
  }

  const handleSelectAll = () => {
    const eligibleAttendees = filteredAttendees.filter((a) => a.isEligible && !a.certificateIssued)
    if (selectedAttendees.length === eligibleAttendees.length) {
      setSelectedAttendees([])
    } else {
      setSelectedAttendees(eligibleAttendees.map((a) => a.id))
    }
  }

  const issueCertificates = () => {
    if (!selectedTemplate || selectedAttendees.length === 0) return

    console.log("Emitiendo constancias:", {
      template: selectedTemplate,
      attendees: selectedAttendees,
    })

    // Aquí iría la lógica para emitir las constancias
    alert(
      `Se emitirán ${selectedAttendees.length} constancias usando la plantilla ${templates.find((t) => t.id === selectedTemplate)?.name}`,
    )
  }

  const revokeCertificate = (attendeeId: number) => {
    console.log("Revocando constancia para:", attendeeId)
    // Aquí iría la lógica para revocar la constancia
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Emisión de Constancias</h1>
          <p className="text-gray-600 mt-2">Genera y administra las constancias de participación</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters and Templates */}
          <div className="lg:col-span-1 space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Evento</label>
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
                  >
                    <option value="all">Todos los eventos</option>
                    {events.slice(1).map((event) => (
                      <option key={event} value={event}>
                        {event}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filterEligible}
                      onChange={(e) => setFilterEligible(e.target.checked)}
                      className="mr-2 text-[#1C8443] focus:ring-[#1C8443]"
                    />
                    <span className="text-sm">Solo elegibles</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Templates */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Plantillas</h3>

              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate === template.id
                        ? "border-[#1C8443] bg-green-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{template.name}</h4>
                        <p className="text-xs text-gray-600">{template.description}</p>
                      </div>
                      <input
                        type="radio"
                        checked={selectedTemplate === template.id}
                        onChange={() => setSelectedTemplate(template.id)}
                        className="text-[#1C8443] focus:ring-[#1C8443]"
                      />
                    </div>
                    <div className="mt-2 text-sm text-gray-700">{template.preview}</div>
                  </div>
                ))}
              </div>

              {selectedTemplate && (
                <button
                  onClick={() => setShowPreview(true)}
                  className="w-full mt-4 py-2 px-4 bg-[#38A2C1] text-white rounded-lg hover:bg-[#67DCD7] transition-colors"
                >
                  👁️ Vista Previa
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Action Bar */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Asistentes Elegibles ({filteredAttendees.filter((a) => a.isEligible).length})
                  </h3>
                  <p className="text-sm text-gray-600">{selectedAttendees.length} seleccionados para emisión</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={issueCertificates}
                    disabled={selectedAttendees.length === 0 || !selectedTemplate}
                    className="px-4 py-2 bg-[#1C8443] text-white rounded-lg hover:bg-[#41AD49] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    🏆 Emitir Seleccionadas
                  </button>
                  <button className="px-4 py-2 bg-[#8DC642] text-white rounded-lg hover:bg-[#41AD49] transition-colors">
                    📊 Exportar Registro
                  </button>
                </div>
              </div>
            </div>

            {/* Attendees Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={
                            selectedAttendees.length ===
                              filteredAttendees.filter((a) => a.isEligible && !a.certificateIssued).length &&
                            filteredAttendees.filter((a) => a.isEligible && !a.certificateIssued).length > 0
                          }
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-[#1C8443] focus:ring-[#1C8443]"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Asistente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Evento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Asistencia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
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
                            disabled={!attendee.isEligible || attendee.certificateIssued}
                            className="rounded border-gray-300 text-[#1C8443] focus:ring-[#1C8443] disabled:opacity-50"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-[#1C8443] rounded-full flex items-center justify-center text-white font-medium">
                              {attendee.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{attendee.name}</div>
                              <div className="text-sm text-gray-500">{attendee.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{attendee.event}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{attendee.attendancePercentage}%</div>
                            <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  attendee.attendancePercentage >= 80 ? "bg-green-500" : "bg-yellow-500"
                                }`}
                                style={{ width: `${attendee.attendancePercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {attendee.certificateIssued ? (
                            <div>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Emitida
                              </span>
                              {attendee.issueDate && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {new Date(attendee.issueDate).toLocaleDateString("es-ES")}
                                </div>
                              )}
                            </div>
                          ) : attendee.isEligible ? (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Elegible
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              No Elegible
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {attendee.certificateIssued ? (
                            <>
                              <button className="text-[#38A2C1] hover:text-[#67DCD7]">📄 Ver</button>
                              <button className="text-[#8DC642] hover:text-[#41AD49]">📧 Reenviar</button>
                              <button
                                onClick={() => revokeCertificate(attendee.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                🗑️ Revocar
                              </button>
                            </>
                          ) : attendee.isEligible ? (
                            <button
                              onClick={() => {
                                setSelectedAttendees([attendee.id])
                                if (selectedTemplate) issueCertificates()
                              }}
                              disabled={!selectedTemplate}
                              className="text-[#1C8443] hover:text-[#41AD49] disabled:text-gray-400"
                            >
                              🏆 Emitir
                            </button>
                          ) : (
                            <span className="text-gray-400">No disponible</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <div className="text-2xl font-bold text-[#1C8443]">
                  {filteredAttendees.filter((a) => a.isEligible).length}
                </div>
                <div className="text-sm text-gray-600">Elegibles</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <div className="text-2xl font-bold text-[#41AD49]">
                  {filteredAttendees.filter((a) => a.certificateIssued).length}
                </div>
                <div className="text-sm text-gray-600">Emitidas</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <div className="text-2xl font-bold text-[#38A2C1]">
                  {filteredAttendees.filter((a) => a.isEligible && !a.certificateIssued).length}
                </div>
                <div className="text-sm text-gray-600">Pendientes</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <div className="text-2xl font-bold text-[#8DC642]">
                  {Math.round(
                    (filteredAttendees.filter((a) => a.certificateIssued).length /
                      filteredAttendees.filter((a) => a.isEligible).length) *
                      100,
                  ) || 0}
                  %
                </div>
                <div className="text-sm text-gray-600">Completado</div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Vista Previa - {templates.find((t) => t.id === selectedTemplate)?.name}
                </h3>
                <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <div className="space-y-4">
                  <div className="text-3xl">🏆</div>
                  <div className="text-xl font-bold text-gray-900">CONSTANCIA DE PARTICIPACIÓN</div>
                  <div className="text-lg text-gray-700">Se otorga a:</div>
                  <div className="text-2xl font-bold text-[#1C8443]">[Nombre del Participante]</div>
                  <div className="text-gray-700">Por su participación en:</div>
                  <div className="text-xl font-semibold text-gray-900">[Nombre del Evento]</div>
                  <div className="text-gray-600">Realizado el [Fecha del Evento]</div>
                  <div className="mt-8 text-sm text-gray-500">
                    {templates.find((t) => t.id === selectedTemplate)?.preview}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cerrar
                </button>
                <button className="px-4 py-2 bg-[#1C8443] text-white rounded-lg hover:bg-[#41AD49] transition-colors">
                  Usar Esta Plantilla
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
