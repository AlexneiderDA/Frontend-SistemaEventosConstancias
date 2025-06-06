import type React from "react"
import { DashboardCard } from "../../components/organizador/DashboardCard"
import { EventCard } from "../../components/organizador/EventCard"

export const DashboardOrganizador: React.FC = () => {
  const stats = [
    {
      title: "Eventos Activos",
      value: 12,
      icon: "📅",
      trend: { value: "+2 este mes", isPositive: true },
      color: "green" as const,
    },
    {
      title: "Total Registros",
      value: 1247,
      icon: "👥",
      trend: { value: "+15% vs mes anterior", isPositive: true },
      color: "blue" as const,
    },
    {
      title: "Asistencias Hoy",
      value: 89,
      icon: "✅",
      trend: { value: "92% de asistencia", isPositive: true },
      color: "cyan" as const,
    },
    {
      title: "Constancias Emitidas",
      value: 456,
      icon: "🏆",
      trend: { value: "+8 hoy", isPositive: true },
      color: "lime" as const,
    },
  ]

  const upcomingEvents = [
    {
      title: "Conferencia de Tecnología 2024",
      date: "15 Dic 2024, 9:00 AM",
      location: "Auditorio Principal",
      status: "upcoming" as const,
      attendees: 85,
      capacity: 100,
    },
    {
      title: "Workshop de Desarrollo Web",
      date: "18 Dic 2024, 2:00 PM",
      location: "Sala de Conferencias A",
      status: "active" as const,
      attendees: 45,
      capacity: 50,
    },
  ]

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Organizador</h1>
          <p className="text-gray-600 mt-2">Resumen general de tus eventos y actividades</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <DashboardCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Eventos Próximos</h2>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <EventCard key={index} {...event} />
                ))}
              </div>
              <button className="w-full mt-4 py-2 px-4 bg-[#1C8443] text-white rounded-lg hover:bg-[#41AD49] transition-colors">
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
                <button className="w-full py-2 px-4 bg-[#41AD49] text-white rounded-lg hover:bg-[#1C8443] transition-colors">
                  ➕ Crear Evento
                </button>
                <button className="w-full py-2 px-4 bg-[#38A2C1] text-white rounded-lg hover:bg-[#67DCD7] transition-colors">
                  👥 Gestionar Asistentes
                </button>
                <button className="w-full py-2 px-4 bg-[#8DC642] text-white rounded-lg hover:bg-[#41AD49] transition-colors">
                  📊 Ver Reportes
                </button>
                <button className="w-full py-2 px-4 bg-[#67DCD7] text-white rounded-lg hover:bg-[#38A2C1] transition-colors">
                  🏆 Emitir Constancias
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notificaciones</h3>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>Recordatorio:</strong> El evento "Workshop React" inicia en 2 horas
                  </p>
                </div>
                <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
                  <p className="text-sm text-green-800">
                    <strong>Éxito:</strong> 15 nuevas constancias emitidas hoy
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                  <p className="text-sm text-blue-800">
                    <strong>Info:</strong> Nuevo auditor asignado al evento "Conferencia Tech"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
