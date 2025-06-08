// src/pages/organizador/GestionEvento.tsx
"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { OrganizadorLayout } from "../../components/organizador/OrganizadorLayout"
import { useEvents } from "../../hooks/useEvents"
import { type EventFilters } from "../../services/event.service"

// Componente de Toast para feedback
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }[type];

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
          ✕
        </button>
      </div>
    </div>
  );
};

export const GestionEventos: React.FC = () => {
  // Estados locales para filtros de UI
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<number | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  // Hook principal de eventos con configuración optimizada
  const {
    // Datos
    events,
    categories,
    pagination,
    
    // Estados
    loading,
    error,
    success,
    deleting,
    duplicating,
    
    // Acciones
    getEvents,
    deleteEvent,
    duplicateEvent,
    loadCategories,
    clearError,
    clearSuccess,
    
    // Paginación
    nextPage,
    prevPage,
    goToPage,
  } = useEvents({
    initialFilters: { page: 1, limit: 10, status: 'active' },
    autoLoad: true,
    loadCategories: true,
  });

  // Construir filtros para la API basados en UI
  const apiFilters = useMemo((): EventFilters => {
    const filters: EventFilters = {
      page: pagination?.page || 1,
      limit: 10,
    };

    if (searchTerm.trim()) {
      filters.search = searchTerm.trim();
    }

    if (statusFilter !== "all") {
      filters.status = statusFilter;
    }

    if (categoryFilter !== "all") {
      filters.category = parseInt(categoryFilter);
    }

    return filters;
  }, [searchTerm, statusFilter, categoryFilter, pagination?.page]);

  // Efecto para aplicar filtros con debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      getEvents({ ...apiFilters, page: 1 }); // Reset a página 1 cuando cambien filtros
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]); // Solo searchTerm necesita debounce

  // Efecto para filtros que no necesitan debounce
  useEffect(() => {
    getEvents({ ...apiFilters, page: 1 });
  }, [statusFilter, categoryFilter]);

  // Manejo de toast para feedback
  useEffect(() => {
    if (success) {
      setToast({ message: "Operación realizada exitosamente", type: 'success' });
      clearSuccess();
    }
  }, [success, clearSuccess]);

  // Colores y etiquetas para estados
  const statusColors = {
    active: "bg-[#41AD49] text-white",
    upcoming: "bg-[#8DC642] text-white",
    completed: "bg-gray-500 text-white",
    cancelled: "bg-red-500 text-white",
  };

  const statusLabels = {
    active: "Activo",
    upcoming: "Próximo",
    completed: "Completado",
    cancelled: "Cancelado",
  };

  // Handlers para acciones
  const handleDeleteEvent = async (id: number) => {
    setEventToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteEvent = async () => {
    if (eventToDelete) {
      const success = await deleteEvent(eventToDelete);
      if (success) {
        setToast({ message: "Evento eliminado exitosamente", type: 'success' });
      }
    }
    setShowDeleteModal(false);
    setEventToDelete(null);
  };

  const handleDuplicateEvent = async (id: number) => {
    const duplicatedEvent = await duplicateEvent(id);
    if (duplicatedEvent) {
      setToast({ message: "Evento duplicado exitosamente", type: 'success' });
    }
  };

  const handlePageChange = async (page: number) => {
    await goToPage(page);
  };

  // Obtener tipos únicos de categorías para el filtro
  const availableCategories = categories.filter(cat => cat.name !== "Sin categoría");

  return (
    <OrganizadorLayout title="Gestión de Eventos">
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Toast de feedback */}
          {toast && (
            <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
            />
          )}

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Eventos</h1>
              <p className="text-gray-600 mt-2">Administra todos tus eventos desde aquí</p>
            </div>
            <button 
              onClick={() => window.location.href = '/organizador/creacion-evento'}
              className="px-6 py-3 bg-[#1C8443] text-white rounded-lg hover:bg-[#41AD49] transition-colors font-medium"
            >
              ➕ Crear Nuevo Evento
            </button>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="text-red-600 mr-3">⚠️</div>
                  <div>
                    <h3 className="text-red-800 font-medium">Error al cargar eventos</h3>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
                <button
                  onClick={clearError}
                  className="text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Filtros y búsqueda */}
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
                  <option value="active">Activos</option>
                  <option value="upcoming">Próximos</option>
                  <option value="completed">Completados</option>
                  <option value="cancelled">Cancelados</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
                >
                  <option value="all">Todas las categorías</option>
                  {availableCategories.map((category) => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button 
                  onClick={() => window.open('/organizador/reportes', '_blank')}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-[#38A2C1] text-white rounded-lg hover:bg-[#67DCD7] transition-colors disabled:bg-gray-400"
                >
                  📊 Exportar Lista
                </button>
              </div>
            </div>
          </div>

          {/* Estado de carga */}
          {loading && (
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1C8443] mr-4"></div>
                <span className="text-gray-600">Cargando eventos...</span>
              </div>
            </div>
          )}

          {/* Tabla de eventos */}
          {!loading && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {events.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-gray-400 text-6xl mb-4">📅</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay eventos</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                      ? "No se encontraron eventos que coincidan con los filtros."
                      : "Aún no has creado ningún evento."}
                  </p>
                  <button
                    onClick={() => window.location.href = '/organizador/creacion-evento'}
                    className="px-4 py-2 bg-[#1C8443] text-white rounded-lg hover:bg-[#41AD49] transition-colors"
                  >
                    ➕ Crear tu primer evento
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Evento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Categoría
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
                      {events.map((event) => (
                        <tr key={event.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{event.title}</div>
                              <div className="text-sm text-gray-500">📍 {event.location}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span 
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: event.category.color }}
                            >
                              {event.category.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(event.startDate).toLocaleDateString("es-ES")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[event.status || 'upcoming']}`}>
                              {statusLabels[event.status || 'upcoming']}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {event.currentRegistrations}/{event.maxCapacity}
                            </div>
                            <div className="text-sm text-gray-500">
                              {event.availableSlots} disponibles
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className="bg-[#41AD49] h-2 rounded-full"
                                style={{ width: `${(event.currentRegistrations / event.maxCapacity) * 100}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button 
                              onClick={() => window.location.href = `/organizador/eventos/${event.id}/editar`}
                              className="text-[#1C8443] hover:text-[#41AD49]"
                              title="Editar evento"
                            >
                              ✏️ Editar
                            </button>
                            <button 
                              onClick={() => handleDuplicateEvent(event.id)}
                              className="text-[#38A2C1] hover:text-[#67DCD7]"
                              disabled={duplicating}
                              title="Duplicar evento"
                            >
                              📋 Duplicar
                            </button>
                            <button 
                              onClick={() => window.location.href = `/organizador/eventos/${event.id}/asistentes`}
                              className="text-[#8DC642] hover:text-[#41AD49]"
                              title="Ver asistentes"
                            >
                              👥 Asistentes
                            </button>
                            <button 
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-red-600 hover:text-red-800"
                              disabled={deleting}
                              title="Eliminar evento"
                            >
                              🗑️ Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Paginación */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {((pagination.page - 1) * pagination.limit) + 1} al {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} eventos
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={prevPage}
                  disabled={!pagination.hasPrev || loading}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  ← Anterior
                </button>
                
                {/* Números de página */}
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const page = i + 1;
                    const isActive = page === pagination.page;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        disabled={loading}
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          isActive
                            ? 'bg-[#1C8443] text-white'
                            : 'bg-white border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={nextPage}
                  disabled={!pagination.hasNext || loading}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}

          {/* Estadísticas resumidas */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-2xl font-bold text-[#1C8443]">{pagination?.total || 0}</div>
              <div className="text-sm text-gray-600">Total Eventos</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-2xl font-bold text-[#41AD49]">
                {events.reduce((sum, event) => sum + event.currentRegistrations, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Registros</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-2xl font-bold text-[#38A2C1]">
                {events.filter(e => e.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Eventos Activos</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-2xl font-bold text-[#8DC642]">
                {events.reduce((sum, event) => sum + event.maxCapacity, 0)}
              </div>
              <div className="text-sm text-gray-600">Capacidad Total</div>
            </div>
          </div>

          {/* Modal de confirmación de eliminación */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmar Eliminación</h3>
                <p className="text-gray-600 mb-6">
                  ¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer y afectará a todos los registrados.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    disabled={deleting}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDeleteEvent}
                    disabled={deleting}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:bg-red-300 flex items-center"
                  >
                    {deleting && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>}
                    {deleting ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </OrganizadorLayout>
  )
}