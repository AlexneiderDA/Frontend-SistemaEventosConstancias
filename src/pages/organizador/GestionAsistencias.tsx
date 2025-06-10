"use client"

import React, { useState, useEffect, useMemo } from "react"
import { OrganizadorLayout } from "../../components/organizador/OrganizadorLayout"
import { useAttendees } from "../../hooks/useAttendees"
import type { AttendeeFilters, CommunicationData, BulkActionData } from "../../services/attendee.service"

interface CommunicationModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCount: number
  onSend: (data: { subject: string; message: string; type: 'email' | 'notification' }) => void
  sending: boolean
}

const CommunicationModal: React.FC<CommunicationModalProps> = ({
  isOpen,
  onClose,
  selectedCount,
  onSend,
  sending
}) => {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [type, setType] = useState<'email' | 'notification'>('email')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (subject.trim() && message.trim()) {
      onSend({ subject, message, type })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Enviar Comunicación ({selectedCount} asistentes)
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'email' | 'notification')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
            >
              <option value="email">Email</option>
              <option value="notification">Notificación</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Asunto</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
              placeholder="Asunto del mensaje"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
              placeholder="Escribe tu mensaje aquí..."
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={sending || !subject.trim() || !message.trim()}
              className="px-4 py-2 bg-[#1C8443] text-white rounded-lg hover:bg-[#41AD49] transition-colors disabled:opacity-50"
            >
              {sending ? "Enviando..." : "📧 Enviar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface GestionAsistentesProps {
  eventId?: number
}

export const GestionAsistentes: React.FC<GestionAsistentesProps> = ({ eventId }) => {
  // Estados locales para filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [eventFilter, setEventFilter] = useState("all")
  const [selectedAttendees, setSelectedAttendees] = useState<number[]>([])
  const [showCommunicationModal, setShowCommunicationModal] = useState(false)

  // Configurar filtros para el hook
  const filters = useMemo<AttendeeFilters>(() => {
    const baseFilters: AttendeeFilters = {
      page: 1,
      limit: 50,
      search: searchTerm.trim() || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
    }

    if (eventId) {
      baseFilters.eventId = eventId
    }

    return baseFilters
  }, [searchTerm, statusFilter, eventId])

  // Usar el hook useAttendees
  const {
    // Datos
    attendees,
    statistics,
    pagination,
    loading,
    error,
    success,
    lastOperationMessage,
    sendingCommunication,
    performingBulkAction,
    exporting,
    
    // Acciones
    loadAttendees,
    sendCommunication,
    performBulkAction,
    exportAttendees,
    checkInAttendee,
    checkOutAttendee,
    removeAttendee,
    clearError,
    clearSuccess,
    nextPage,
    prevPage,
    goToPage,
  } = useAttendees({
    eventId,
    initialFilters: filters,
    autoLoad: true,
  })

  // Cargar datos cuando cambien los filtros
  useEffect(() => {
    loadAttendees(eventId, filters)
  }, [filters, eventId])

  // Limpiar mensajes de éxito después de 3 segundos
  useEffect(() => {
    if (success && lastOperationMessage) {
      const timer = setTimeout(() => {
        clearSuccess()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success, lastOperationMessage, clearSuccess])

  // Eventos únicos para el filtro (si no hay eventId específico)
  const uniqueEvents = useMemo(() => {
    if (eventId) return []
    const events = attendees.map(a => a.event.title)
    return Array.from(new Set(events))
  }, [attendees, eventId])

  const statusColors = {
    registered: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    attended: "bg-green-100 text-green-800",
    absent: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
  }

  const statusLabels = {
    registered: "Registrado",
    confirmed: "Confirmado",
    attended: "Asistió",
    absent: "Ausente",
    cancelled: "Cancelado",
  }

  // Filtrar asistentes localmente por evento (si aplica)
  const filteredAttendees = useMemo(() => {
    if (eventFilter === "all" || eventId) return attendees
    return attendees.filter(attendee => attendee.event.title === eventFilter)
  }, [attendees, eventFilter, eventId])

  const handleSelectAll = () => {
    if (selectedAttendees.length === filteredAttendees.length) {
      setSelectedAttendees([])
    } else {
      setSelectedAttendees(filteredAttendees.map(a => a.id))
    }
  }

  const handleSelectAttendee = (id: number) => {
    setSelectedAttendees(prev => 
      prev.includes(id) 
        ? prev.filter(attendeeId => attendeeId !== id) 
        : [...prev, id]
    )
  }

  const handleSendCommunication = async (data: { subject: string; message: string; type: 'email' | 'notification' }) => {
    const communicationData: CommunicationData = {
      attendeeIds: selectedAttendees,
      subject: data.subject,
      message: data.message,
      type: data.type,
    }

    const success = await sendCommunication(communicationData)
    if (success) {
      setShowCommunicationModal(false)
      setSelectedAttendees([])
    }
  }

  const handleBulkDelete = async () => {
    if (selectedAttendees.length === 0) return
    
    if (window.confirm(`¿Estás seguro de que quieres eliminar ${selectedAttendees.length} asistente(s)?`)) {
      const bulkData: BulkActionData = {
        attendeeIds: selectedAttendees,
        action: 'delete',
      }

      const success = await performBulkAction(bulkData)
      if (success) {
        setSelectedAttendees([])
      }
    }
  }

  const handleExport = async () => {
    if (!eventId) return
    
    const downloadUrl = await exportAttendees(eventId, 'excel', filters)
    if (downloadUrl) {
      window.open(downloadUrl, '_blank')
    }
  }

  const handleCheckIn = async (attendeeId: number) => {
    await checkInAttendee(attendeeId)
  }

  const handleCheckOut = async (attendeeId: number) => {
    await checkOutAttendee(attendeeId)
  }

  const handleRemoveAttendee = async (attendeeId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este asistente?')) {
      await removeAttendee(attendeeId)
    }
  }

  return (
    <OrganizadorLayout title="Gestión de Asistentes">
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
              <span>{error}</span>
              <button onClick={clearError} className="text-red-500 hover:text-red-700">
                ✕
              </button>
            </div>
          )}

          {success && lastOperationMessage && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex justify-between items-center">
              <span>{lastOperationMessage}</span>
              <button onClick={clearSuccess} className="text-green-500 hover:text-green-700">
                ✕
              </button>
            </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Asistentes</h1>
              <p className="text-gray-600 mt-2">
                {eventId ? "Administra los participantes de este evento" : "Administra los participantes de tus eventos"}
              </p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowCommunicationModal(true)}
                disabled={selectedAttendees.length === 0}
                className="px-4 py-2 bg-[#38A2C1] text-white rounded-lg hover:bg-[#67DCD7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📧 Comunicaciones
              </button>
              {eventId && (
                <button 
                  onClick={handleExport}
                  disabled={exporting}
                  className="px-4 py-2 bg-[#8DC642] text-white rounded-lg hover:bg-[#41AD49] transition-colors disabled:opacity-50"
                >
                  {exporting ? "Exportando..." : "📊 Exportar Lista"}
                </button>
              )}
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
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
              {!eventId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Evento</label>
                  <select
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
                  >
                    <option value="all">Todos los eventos</option>
                    {uniqueEvents.map((event) => (
                      <option key={event} value={event}>
                        {event}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex items-end">
                <button 
                  onClick={() => loadAttendees(eventId, filters)}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-[#67DCD7] text-white rounded-lg hover:bg-[#38A2C1] transition-colors disabled:opacity-50"
                >
                  {loading ? "Cargando..." : "🔍 Actualizar"}
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
                    disabled={sendingCommunication}
                    className="px-4 py-2 bg-white text-[#1C8443] rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    {sendingCommunication ? "Enviando..." : "📧 Enviar Comunicación"}
                  </button>
                  <button 
                    onClick={handleBulkDelete}
                    disabled={performingBulkAction}
                    className="px-4 py-2 bg-white text-[#1C8443] rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    {performingBulkAction ? "Eliminando..." : "🗑️ Eliminar Seleccionados"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C8443] mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando asistentes...</p>
            </div>
          )}

          {/* Attendees Table */}
          {!loading && (
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
                      {!eventId && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Evento
                        </th>
                      )}
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
                              {attendee.user.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{attendee.user.name}</div>
                              {attendee.attendanceCheckedIn && (
                                <div className="text-sm text-gray-500">
                                  Check-in: {new Date(attendee.attendanceCheckedIn).toLocaleTimeString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{attendee.user.email}</div>
                          <div className="text-sm text-gray-500">{attendee.user.profile?.phone || 'N/A'}</div>
                        </td>
                        {!eventId && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {attendee.event.title}
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[attendee.status]}`}>
                            {statusLabels[attendee.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(attendee.registrationDate).toLocaleDateString("es-ES")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {attendee.status !== 'attended' && (
                            <button 
                              onClick={() => handleCheckIn(attendee.id)}
                              className="text-[#1C8443] hover:text-[#41AD49]"
                            >
                              ✅ Check-in
                            </button>
                          )}
                          {attendee.status === 'attended' && !attendee.attendanceCheckedOut && (
                            <button 
                              onClick={() => handleCheckOut(attendee.id)}
                              className="text-[#38A2C1] hover:text-[#67DCD7]"
                            >
                              🚪 Check-out
                            </button>
                          )}
                          <button 
                            onClick={() => handleRemoveAttendee(attendee.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            🗑️ Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-700">
                        Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{' '}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
                        {pagination.total} resultados
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={prevPage}
                        disabled={!pagination.hasPrev || loading}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>
                      <span className="px-3 py-2 text-sm text-gray-700">
                        Página {pagination.page} de {pagination.pages}
                      </span>
                      <button
                        onClick={nextPage}
                        disabled={!pagination.hasNext || loading}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Summary Stats */}
          {statistics && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <div className="text-2xl font-bold text-[#1C8443]">{statistics.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <div className="text-2xl font-bold text-[#41AD49]">{statistics.attended}</div>
                <div className="text-sm text-gray-600">Asistieron</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <div className="text-2xl font-bold text-[#38A2C1]">{statistics.confirmed}</div>
                <div className="text-sm text-gray-600">Confirmados</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <div className="text-2xl font-bold text-[#8DC642]">{statistics.registered}</div>
                <div className="text-sm text-gray-600">Registrados</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <div className="text-2xl font-bold text-gray-600">{statistics.cancelled}</div>
                <div className="text-sm text-gray-600">Cancelados</div>
              </div>
            </div>
          )}

          {/* Communication Modal */}
          <CommunicationModal
            isOpen={showCommunicationModal}
            onClose={() => setShowCommunicationModal(false)}
            selectedCount={selectedAttendees.length}
            onSend={handleSendCommunication}
            sending={sendingCommunication}
          />
        </div>
      </div>
    </OrganizadorLayout>
  )
}