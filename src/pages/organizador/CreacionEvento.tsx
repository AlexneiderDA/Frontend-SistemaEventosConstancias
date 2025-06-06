"use client"

import type React from "react"
import { useState } from "react"

interface EventForm {
  name: string
  type: string
  description: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  location: string
  capacity: number
  requirements: string
  sessions: Session[]
}

interface Session {
  id: number
  name: string
  date: string
  startTime: string
  endTime: string
  speaker: string
}

export const CreacionEvento: React.FC = () => {
  const [formData, setFormData] = useState<EventForm>({
    name: "",
    type: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    location: "",
    capacity: 0,
    requirements: "",
    sessions: [],
  })

  const [showPreview, setShowPreview] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const eventTypes = ["Conferencia", "Taller", "Seminario", "Workshop", "Curso", "Webinar"]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const addSession = () => {
    const newSession: Session = {
      id: Date.now(),
      name: "",
      date: formData.startDate,
      startTime: "",
      endTime: "",
      speaker: "",
    }

    setFormData((prev) => ({
      ...prev,
      sessions: [...prev.sessions, newSession],
    }))
  }

  const updateSession = (id: number, field: keyof Session, value: string) => {
    setFormData((prev) => ({
      ...prev,
      sessions: prev.sessions.map((session) => (session.id === id ? { ...session, [field]: value } : session)),
    }))
  }

  const removeSession = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((session) => session.id !== id),
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "El nombre es requerido"
    if (!formData.type) newErrors.type = "El tipo es requerido"
    if (!formData.startDate) newErrors.startDate = "La fecha de inicio es requerida"
    if (!formData.location.trim()) newErrors.location = "La ubicación es requerida"
    if (formData.capacity <= 0) newErrors.capacity = "La capacidad debe ser mayor a 0"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      console.log("Evento creado:", formData)
      // Aquí iría la lógica para guardar el evento
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Evento</h1>
          <p className="text-gray-600 mt-2">Completa la información para crear tu evento</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Información Básica</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Evento *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Ej: Conferencia de Tecnología 2024"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Evento *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent ${
                        errors.type ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Seleccionar tipo</option>
                      {eventTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
                    placeholder="Describe tu evento..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio *</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent ${
                        errors.startDate ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Fin</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hora de Inicio</label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hora de Fin</label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent ${
                        errors.location ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Ej: Auditorio Principal"
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Capacidad *</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      min="1"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent ${
                        errors.capacity ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="100"
                    />
                    {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requisitos</label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
                    placeholder="Requisitos para participar..."
                  />
                </div>
              </div>

              {/* Sessions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Sesiones</h2>
                  <button
                    type="button"
                    onClick={addSession}
                    className="px-4 py-2 bg-[#38A2C1] text-white rounded-lg hover:bg-[#67DCD7] transition-colors"
                  >
                    ➕ Agregar Sesión
                  </button>
                </div>

                {formData.sessions.map((session, index) => (
                  <div key={session.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-900">Sesión {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeSession(session.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Sesión</label>
                        <input
                          type="text"
                          value={session.name}
                          onChange={(e) => updateSession(session.id, "name", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
                          placeholder="Ej: Introducción a React"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ponente</label>
                        <input
                          type="text"
                          value={session.speaker}
                          onChange={(e) => updateSession(session.id, "speaker", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
                          placeholder="Nombre del ponente"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hora de Inicio</label>
                        <input
                          type="time"
                          value={session.startTime}
                          onChange={(e) => updateSession(session.id, "startTime", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hora de Fin</label>
                        <input
                          type="time"
                          value={session.endTime}
                          onChange={(e) => updateSession(session.id, "endTime", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-6 py-3 bg-[#8DC642] text-white rounded-lg hover:bg-[#41AD49] transition-colors"
                >
                  👁️ Vista Previa
                </button>
                <button
                  type="button"
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#1C8443] text-white rounded-lg hover:bg-[#41AD49] transition-colors"
                >
                  💾 Guardar Evento
                </button>
              </div>
            </form>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            {showPreview && (
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa</h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Nombre:</span>
                    <p className="text-gray-900">{formData.name || "Sin nombre"}</p>
                  </div>

                  <div>
                    <span className="font-medium text-gray-700">Tipo:</span>
                    <p className="text-gray-900">{formData.type || "Sin tipo"}</p>
                  </div>

                  <div>
                    <span className="font-medium text-gray-700">Fecha:</span>
                    <p className="text-gray-900">
                      {formData.startDate ? new Date(formData.startDate).toLocaleDateString("es-ES") : "Sin fecha"}
                    </p>
                  </div>

                  <div>
                    <span className="font-medium text-gray-700">Ubicación:</span>
                    <p className="text-gray-900">{formData.location || "Sin ubicación"}</p>
                  </div>

                  <div>
                    <span className="font-medium text-gray-700">Capacidad:</span>
                    <p className="text-gray-900">{formData.capacity || 0} personas</p>
                  </div>

                  {formData.description && (
                    <div>
                      <span className="font-medium text-gray-700">Descripción:</span>
                      <p className="text-gray-900 text-xs">{formData.description}</p>
                    </div>
                  )}

                  {formData.sessions.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">Sesiones:</span>
                      <ul className="text-gray-900 text-xs space-y-1">
                        {formData.sessions.map((session, index) => (
                          <li key={session.id}>
                            {index + 1}. {session.name || "Sin nombre"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
