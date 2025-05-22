"use client"

import { useState, useEffect } from "react"
import { Bell, Award, Calendar, X } from "lucide-react"

interface Notificacion {
  id: number
  tipo: "constancia" | "evento"
  titulo: string
  descripcion: string
  fecha: string
  leida: boolean
}

const Notificaciones = () => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])

  // Simular carga de datos
  useEffect(() => {
    // En un caso real, aquí harías una llamada a tu API
    const notificacionesData: Notificacion[] = [
      {
        id: 1,
        tipo: "constancia",
        titulo: "Constancia disponible",
        descripcion: "Tu constancia del Taller de Desarrollo Web ya está disponible para descarga.",
        fecha: "Hace 2 días",
        leida: false,
      },
      {
        id: 2,
        tipo: "evento",
        titulo: "Evento próximo",
        descripcion: "Recuerda que el Seminario de Ciberseguridad comienza mañana a las 9:00 AM.",
        fecha: "Hace 5 horas",
        leida: false,
      },
      {
        id: 3,
        tipo: "constancia",
        titulo: "Constancia disponible",
        descripcion: "Tu constancia de la Conferencia de IA ya está disponible para descarga.",
        fecha: "Hace 1 semana",
        leida: true,
      },
    ]

    setNotificaciones(notificacionesData)
  }, [])

  const marcarComoLeida = (id: number) => {
    setNotificaciones((prevNotificaciones) =>
      prevNotificaciones.map((notif) => (notif.id === id ? { ...notif, leida: true } : notif)),
    )
  }

  const eliminarNotificacion = (id: number) => {
    setNotificaciones((prevNotificaciones) => prevNotificaciones.filter((notif) => notif.id !== id))
  }

  const notificacionesNoLeidas = notificaciones.filter((notif) => !notif.leida).length

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#1C8443] flex items-center">
          <Bell size={20} className="mr-2" />
          Notificaciones
          {notificacionesNoLeidas > 0 && (
            <span className="ml-2 bg-[#38A2C1] text-white text-xs font-bold px-2 py-1 rounded-full">
              {notificacionesNoLeidas}
            </span>
          )}
        </h2>
        {notificaciones.length > 0 && (
          <button onClick={() => setNotificaciones([])} className="text-sm text-gray-500 hover:text-[#1C8443]">
            Limpiar todo
          </button>
        )}
      </div>

      {notificaciones.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <p>No tienes notificaciones pendientes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notificaciones.map((notificacion) => (
            <div
              key={notificacion.id}
              className={`relative p-4 rounded-lg border-l-4 ${
                notificacion.leida ? "bg-gray-50 border-gray-300" : "bg-[#67DCD7]/10 border-[#38A2C1]"
              }`}
            >
              <div className="flex items-start">
                <div className="mr-3">
                  {notificacion.tipo === "constancia" ? (
                    <Award size={20} className="text-[#8DC642]" />
                  ) : (
                    <Calendar size={20} className="text-[#41AD49]" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{notificacion.titulo}</h3>
                  <p className="text-sm text-gray-600 mt-1">{notificacion.descripcion}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{notificacion.fecha}</span>
                    {!notificacion.leida && (
                      <button
                        onClick={() => marcarComoLeida(notificacion.id)}
                        className="text-xs text-[#38A2C1] hover:underline"
                      >
                        Marcar como leída
                      </button>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => eliminarNotificacion(notificacion.id)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                  aria-label="Eliminar notificación"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-center">
        <a href="/notificaciones" className="text-sm text-[#38A2C1] hover:text-[#1C8443] font-medium">
          Ver todas las notificaciones
        </a>
      </div>
    </div>
  )
}

export default Notificaciones
