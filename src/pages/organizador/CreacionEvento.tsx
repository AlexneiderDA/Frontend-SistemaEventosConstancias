"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { OrganizadorLayout } from "../../components/organizador/OrganizadorLayout"
import { useEvents } from "../../hooks/useEvents"
import type { CreateEventData } from "../../services/event.service"

interface EventForm {
  name: string
  type: string
  description: string
  shortDescription: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  location: string
  address: string
  capacity: number
  requirements: string
  requiresCertificate: boolean
  isFeatured: boolean
  tags: string
}

export const CreacionEvento: React.FC = () => {
  const navigate = useNavigate()
  const { 
    categories, 
    loading, 
    error, 
    success, 
    createEvent, 
    loadCategories, 
    clearError,
    clearSuccess 
  } = useEvents()

  const [formData, setFormData] = useState<EventForm>({
    name: "",
    type: "",
    description: "",
    shortDescription: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    location: "",
    address: "",
    capacity: 0,
    requirements: "",
    requiresCertificate: false,
    isFeatured: false,
    tags: "",
  })

  const [showPreview, setShowPreview] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Cargar categorías al montar el componente
  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  // Redireccionar al éxito
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/organizador/gestion-eventos')
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [success, navigate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? Number(value) : value,
    }))

    // Clear errors when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
    if (error) {
      clearError()
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validaciones básicas
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido"
    if (formData.name.length < 3) newErrors.name = "El nombre debe tener al menos 3 caracteres"
    if (formData.name.length > 200) newErrors.name = "El nombre no puede exceder 200 caracteres"
    
    if (!formData.type) newErrors.type = "El tipo es requerido"
    
    if (!formData.description.trim()) newErrors.description = "La descripción es requerida"
    if (formData.description.length < 10) newErrors.description = "La descripción debe tener al menos 10 caracteres"
    if (formData.description.length > 5000) newErrors.description = "La descripción no puede exceder 5000 caracteres"
    
    if (!formData.startDate) newErrors.startDate = "La fecha de inicio es requerida"
    if (!formData.endDate) newErrors.endDate = "La fecha de fin es requerida"
    if (!formData.startTime) newErrors.startTime = "La hora de inicio es requerida"
    if (!formData.endTime) newErrors.endTime = "La hora de fin es requerida"
    
    if (!formData.location.trim()) newErrors.location = "La ubicación es requerida"
    if (formData.location.length < 3) newErrors.location = "La ubicación debe tener al menos 3 caracteres"
    
    if (formData.capacity <= 0) newErrors.capacity = "La capacidad debe ser mayor a 0"
    if (formData.capacity > 10000) newErrors.capacity = "La capacidad no puede exceder 10,000"

    // Validar fechas
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate)
      const endDate = new Date(formData.endDate)
      const now = new Date()
      
      if (startDate < now) {
        newErrors.startDate = "La fecha de inicio no puede ser en el pasado"
      }
      
      if (endDate <= startDate) {
        newErrors.endDate = "La fecha de fin debe ser posterior a la fecha de inicio"
      }
    }

    // Validar horas
    if (formData.startTime && formData.endTime && formData.startDate === formData.endDate) {
      const [startHour, startMin] = formData.startTime.split(':').map(Number)
      const [endHour, endMin] = formData.endTime.split(':').map(Number)
      const startMinutes = startHour * 60 + startMin
      const endMinutes = endHour * 60 + endMin
      
      if (endMinutes <= startMinutes) {
        newErrors.endTime = "La hora de fin debe ser posterior a la hora de inicio"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const convertFormDataToApiData = (): CreateEventData => {
    const categoryId = parseInt(formData.type)
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}:00`)
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}:00`)
    
    const requirements = formData.requirements
      .split('\n')
      .map(req => req.trim())
      .filter(req => req.length > 0)
    
    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    return {
      title: formData.name.trim(),
      description: formData.description.trim(),
      shortDescription: formData.shortDescription.trim() || undefined,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location.trim(),
      address: formData.address.trim() || undefined,
      categoryId,
      maxCapacity: formData.capacity,
      requiresCertificate: formData.requiresCertificate,
      isFeatured: formData.isFeatured,
      requirements: requirements.length > 0 ? requirements : undefined,
      tags: tags.length > 0 ? tags : undefined,
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      const firstError = document.querySelector('.error-message')
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    const apiData = convertFormDataToApiData()
    await createEvent(apiData)
  }

  // Loading de categorías
  if (categories.length === 0 && loading) {
    return (
      <OrganizadorLayout title="Crear Evento">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1C8443]"></div>
        </div>
      </OrganizadorLayout>
    )
  }

  // Pantalla de éxito
  if (success) {
    return (
      <OrganizadorLayout title="Crear Evento">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-2xl">✅</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#1C8443] mb-4">¡Evento Creado!</h2>
          <p className="text-gray-600 mb-6">
            Tu evento <strong>{formData.name}</strong> ha sido creado exitosamente.
          </p>
          <p className="text-sm text-gray-500">
            Redirigiendo a la gestión de eventos...
          </p>
        </div>
      </OrganizadorLayout>
    )
  }

  return (
    <OrganizadorLayout title="Crear Evento">
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Evento</h1>
            <p className="text-gray-600 mt-2">Completa la información para crear tu evento</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-400 text-xl">❌</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error al crear evento</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

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
                        disabled={loading}
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1 error-message">{errors.name}</p>}
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
                        disabled={loading}
                      >
                        <option value="">Seleccionar tipo</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.type && <p className="text-red-500 text-sm mt-1 error-message">{errors.type}</p>}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent ${
                        errors.description ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Describe tu evento..."
                      disabled={loading}
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1 error-message">{errors.description}</p>}
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción Corta</label>
                    <textarea
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
                      placeholder="Descripción breve para listados..."
                      disabled={loading}
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
                        disabled={loading}
                      />
                      {errors.startDate && <p className="text-red-500 text-sm mt-1 error-message">{errors.startDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Fin *</label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent ${
                          errors.endDate ? "border-red-500" : "border-gray-300"
                        }`}
                        disabled={loading}
                      />
                      {errors.endDate && <p className="text-red-500 text-sm mt-1 error-message">{errors.endDate}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hora de Inicio *</label>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent ${
                          errors.startTime ? "border-red-500" : "border-gray-300"
                        }`}
                        disabled={loading}
                      />
                      {errors.startTime && <p className="text-red-500 text-sm mt-1 error-message">{errors.startTime}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hora de Fin *</label>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent ${
                          errors.endTime ? "border-red-500" : "border-gray-300"
                        }`}
                        disabled={loading}
                      />
                      {errors.endTime && <p className="text-red-500 text-sm mt-1 error-message">{errors.endTime}</p>}
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
                        disabled={loading}
                      />
                      {errors.location && <p className="text-red-500 text-sm mt-1 error-message">{errors.location}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Capacidad *</label>
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        min="1"
                        max="10000"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent ${
                          errors.capacity ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="100"
                        disabled={loading}
                      />
                      {errors.capacity && <p className="text-red-500 text-sm mt-1 error-message">{errors.capacity}</p>}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
                      placeholder="Dirección completa del evento"
                      disabled={loading}
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Requisitos</label>
                    <textarea
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
                      placeholder="Requisitos para participar (uno por línea)..."
                      disabled={loading}
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Etiquetas</label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
                      placeholder="tecnología, innovación, educación (separadas por comas)"
                      disabled={loading}
                    />
                  </div>

                  <div className="mt-4 space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="requiresCertificate"
                        checked={formData.requiresCertificate}
                        onChange={handleInputChange}
                        className="mr-2 text-[#1C8443] focus:ring-[#1C8443]"
                        disabled={loading}
                      />
                      <span className="text-sm">Requiere constancia de participación</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                        className="mr-2 text-[#1C8443] focus:ring-[#1C8443]"
                        disabled={loading}
                      />
                      <span className="text-sm">Marcar como evento destacado</span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    disabled={loading}
                    className="px-6 py-3 bg-[#8DC642] text-white rounded-lg hover:bg-[#41AD49] transition-colors disabled:bg-gray-400"
                  >
                    👁️ Vista Previa
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/organizador/gestion-eventos')}
                    disabled={loading}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-[#1C8443] text-white rounded-lg hover:bg-[#41AD49] transition-colors disabled:bg-gray-400 flex items-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Creando...
                      </>
                    ) : (
                      <>💾 Guardar Evento</>
                    )}
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
                      <p className="text-gray-900">
                        {formData.type 
                          ? categories.find(c => c.id === parseInt(formData.type))?.name || "Sin tipo"
                          : "Sin tipo"
                        }
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Fecha:</span>
                      <p className="text-gray-900">
                        {formData.startDate 
                          ? `${new Date(formData.startDate).toLocaleDateString("es-ES")} ${formData.startTime || ''}`
                          : "Sin fecha"
                        }
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
                        <p className="text-gray-900 text-xs">{formData.description.substring(0, 100)}...</p>
                      </div>
                    )}
                    <div className="pt-3 border-t">
                      <div className="flex items-center space-x-2 text-xs">
                        {formData.requiresCertificate && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                            📜 Con constancia
                          </span>
                        )}
                        {formData.isFeatured && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            ⭐ Destacado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </OrganizadorLayout>
  )
}