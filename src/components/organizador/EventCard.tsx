import type React from "react"

interface EventCardProps {
  title: string
  date: string
  location: string
  status: "active" | "upcoming" | "completed" | "cancelled"
  attendees: number
  capacity: number
}

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

export const EventCard: React.FC<EventCardProps> = ({ title, date, location, status, attendees, capacity }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {statusLabels[status]}
        </span>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <p>📅 {date}</p>
        <p>📍 {location}</p>
        <div className="flex justify-between items-center pt-2">
          <span>
            👥 {attendees}/{capacity} asistentes
          </span>
          <div className="w-20 bg-gray-200 rounded-full h-2">
            <div className="bg-[#41AD49] h-2 rounded-full" style={{ width: `${(attendees / capacity) * 100}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
