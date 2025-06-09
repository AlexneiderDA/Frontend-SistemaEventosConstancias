import type React from "react"
import { useEffect } from "react"
import { DashboardCard } from "../../components/organizador/DashboardCard"
import { OrganizadorLayout } from "../../components/organizador/OrganizadorLayout"
import { useDashboard } from "../../hooks/useDashboard"
import { dashboardService } from "../../services/dashboard.service"

export const DashboardOrganizador: React.FC = () => {
  const {
    // Datos
    stats,
    upcomingEvents,
    notifications,
    unreadNotificationsCount,
    
    // Estados de carga
    statsLoading,
    eventsLoading,
    notificationsLoading,
    
    // Estados de error
    statsError,
    eventsError,
    notificationsError,
    
    // Acciones
    loadAllData,
    markNotificationAsRead,
    refreshData,
    clearErrors,
    
    // Helpers
    getStatTrend,
    getEventStatusInfo,
    getNotificationIcon,
    
    // Metadata
    lastUpdated,
  } = useDashboard({
    autoLoad: true,
    refreshInterval: 5 * 60 * 1000, // Refresh cada 5 minutos
    role: 'organizer'
  });

  // Preparar datos para las tarjetas de estadísticas
  const statsCards = stats ? [
    {
      title: "Eventos Activos",
      value: stats.events.active,
      icon: "📅",
      trend: getStatTrend('events'),
      color: "green" as const,
    },
    {
      title: "Total Registros",
      value: stats.registrations.total.toLocaleString(),
      icon: "👥",
      trend: getStatTrend('registrations'),
      color: "blue" as const,
    },
    {
      title: "Asistencias Hoy",
      value: stats.attendance.today,
      icon: "✅",
      trend: { 
        value: stats.attendance.rate, 
        isPositive: stats.attendance.rate >= 80, 
        text: `${stats.attendance.rate}% de asistencia` 
      },
      color: "cyan" as const,
    },
    {
      title: "Constancias Emitidas",
      value: stats.certificates.total,
      icon: "🏆",
      trend: { 
        value: stats.certificates.today, 
        isPositive: true, 
        text: `+${stats.certificates.today} hoy` 
      },
      color: "lime" as const,
    },
  ] : [];

  // Función para manejar click en notificación
  const handleNotificationClick = async (notificationId: number) => {
    await markNotificationAsRead(notificationId);
  };

  // Función para obtener color de notificación
  const getNotificationColor = (type: string) => {
    const colors = {
      'event': 'blue',
      'certificate': 'green',
      'reminder': 'yellow',
      'update': 'purple',
      'warning': 'orange',
      'error': 'red',
      'success': 'green'
    };
    return colors[type as keyof typeof colors] || 'blue';
  };

  return (
    <OrganizadorLayout title="Dashboard de Organizador">
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard de Organizador</h1>
                <p className="text-gray-600 mt-2">Resumen general de tus eventos y actividades</p>
                {lastUpdated && (
                  <p className="text-sm text-gray-500 mt-1">
                    Última actualización: {lastUpdated.toLocaleTimeString('es-ES')}
                  </p>
                )}
              </div>
              <button
                onClick={refreshData}
                disabled={statsLoading}
                className="px-4 py-2 bg-[#1C8443] text-white rounded-lg hover:bg-[#41AD49] transition-colors disabled:bg-gray-400 flex items-center"
              >
                {statsLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Cargando...
                  </>
                ) : (
                  <>🔄 Actualizar</>
                )}
              </button>
            </div>
          </div>

          {/* Error Messages */}
          {(statsError || eventsError || notificationsError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="text-red-600 mr-3">⚠️</div>
                  <div>
                    <h3 className="text-red-800 font-medium">Error al cargar datos</h3>
                    <div className="text-red-700 text-sm space-y-1">
                      {statsError && <p>• Estadísticas: {statsError}</p>}
                      {eventsError && <p>• Eventos: {eventsError}</p>}
                      {notificationsError && <p>• Notificaciones: {notificationsError}</p>}
                    </div>
                  </div>
                </div>
                <button
                  onClick={clearErrors}
                  className="text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsLoading ? (
              // Skeleton loading
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              ))
            ) : (
              statsCards.map((stat, index) => (
                <DashboardCard key={index} {...stat} />
              ))
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Events Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Eventos Próximos</h2>
                  {eventsLoading && (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#1C8443]"></div>
                  )}
                </div>
                
                {eventsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg animate-pulse">
                        <div className="flex justify-between items-start mb-2">
                          <div className="h-5 bg-gray-200 rounded w-48"></div>
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-4 bg-gray-200 rounded w-40"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => {
                      const statusInfo = getEventStatusInfo(event);
                      return (
                        <div key={event.id} className={`p-4 border rounded-lg transition-colors ${
                          statusInfo.urgent ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900">{event.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              statusInfo.color === 'red' ? 'bg-red-100 text-red-800' :
                              statusInfo.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {statusInfo.label}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>📅 {new Date(event.startDate).toLocaleDateString('es-ES')} a las {event.startTime}</p>
                            <p>📍 {event.location}</p>
                            <p>👥 {event.registrations}/{event.maxCapacity} registrados</p>
                            {statusInfo.urgent && (
                              <p className="text-red-600 font-medium">
                                ⏰ Inicia en {event.hoursUntil} {event.hoursUntil === 1 ? 'hora' : 'horas'}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-4">📅</div>
                    <p>No hay eventos próximos</p>
                  </div>
                )}
                
                <button 
                  onClick={() => window.location.href = '/organizador/gestion-eventos'}
                  className="w-full mt-4 py-2 px-4 bg-[#1C8443] text-white rounded-lg hover:bg-[#41AD49] transition-colors"
                >
                  Ver Todos los Eventos
                </button>
              </div>
            </div>

            {/* Quick Actions & Notifications */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Accesos Rápidos</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => window.location.href = '/organizador/creacion-evento'}
                    className="w-full py-2 px-4 bg-[#41AD49] text-white rounded-lg hover:bg-[#1C8443] transition-colors"
                  >
                    ➕ Crear Evento
                  </button>
                  <button 
                    onClick={() => window.location.href = '/organizador/gestion-asistentes'}
                    className="w-full py-2 px-4 bg-[#38A2C1] text-white rounded-lg hover:bg-[#67DCD7] transition-colors"
                  >
                    👥 Gestionar Asistentes
                  </button>
                  <button 
                    onClick={() => window.location.href = '/organizador/reportes'}
                    className="w-full py-2 px-4 bg-[#8DC642] text-white rounded-lg hover:bg-[#41AD49] transition-colors"
                  >
                    📊 Ver Reportes
                  </button>
                  <button 
                    onClick={() => window.location.href = '/organizador/emision-constancias'}
                    className="w-full py-2 px-4 bg-[#67DCD7] text-white rounded-lg hover:bg-[#38A2C1] transition-colors"
                  >
                    🏆 Emitir Constancias
                  </button>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
                  {unreadNotificationsCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </div>
                
                {notificationsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : notifications.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {notifications.slice(0, 5).map((notification) => {
                      const notificationIcon = getNotificationIcon(notification);
                      const colorClasses = {
                        blue: 'bg-blue-50 border-blue-400 text-blue-800',
                        green: 'bg-green-50 border-green-400 text-green-800',
                        yellow: 'bg-yellow-50 border-yellow-400 text-yellow-800',
                        red: 'bg-red-50 border-red-400 text-red-800',
                        orange: 'bg-orange-50 border-orange-400 text-orange-800',
                        purple: 'bg-purple-50 border-purple-400 text-purple-800',
                        gray: 'bg-gray-50 border-gray-400 text-gray-800'
                      };
                      const colorClass = colorClasses[notificationIcon.color as keyof typeof colorClasses] || colorClasses.gray;
                      
                      return (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification.id)}
                          className={`p-3 border-l-4 rounded cursor-pointer transition-opacity ${colorClass} ${
                            notification.isRead ? 'opacity-60' : ''
                          }`}
                        >
                          <div className="flex items-start">
                            <span className="text-lg mr-2">{notificationIcon.icon}</span>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{notification.title}</p>
                              <p className="text-xs mt-1">{notification.message}</p>
                              <p className="text-xs mt-1 opacity-75">
                                {dashboardService.getTimeAgo(notification.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <div className="text-2xl mb-2">🔔</div>
                    <p className="text-sm">No hay notificaciones</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </OrganizadorLayout>
  )
}