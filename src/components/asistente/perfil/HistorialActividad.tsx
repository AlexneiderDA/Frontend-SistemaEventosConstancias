"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Clock, Calendar, Award, User, Lock, Mail, Bell, Filter } from "lucide-react"

interface ActividadItem {
  id: string
  tipo: "evento" | "constancia" | "perfil" | "seguridad" | "correo" | "notificaciones"
  descripcion: string
  fecha: string
}

const HistorialActividad: React.FC = () => {
  const [actividades, setActividades] = useState<ActividadItem[]>([])
  const [filtroTipo, setFiltroTipo] = useState<string>("todos")
  const [cargando, setCargando] = useState(true)

  // Simular carga de datos
  useEffect(() => {
    // En un caso real, aquí harías una llamada a tu API
    setTimeout(() => {
      const actividadesData: ActividadItem[] = [
        {
          id: "1",
          tipo: "evento",
          descripcion: "Te registraste al evento 'Conferencia de Inteligencia Artificial'",
          fecha: "28 de Abril, 2025 - 14:30",
        },
        {
          id: "2",
          tipo: "constancia",
          descripcion: "Descargaste la constancia del evento 'Seminario de Ciberseguridad'",
          fecha: "12 de Abril, 2025 - 16:45",
        },
        {
          id: "3",
          tipo: "perfil",
          descripcion: "Actualizaste tus datos personales",
          fecha: "5 de Abril, 2025 - 10:20",
        },
        {
          id: "4",
          tipo: "seguridad",
          descripcion: "Cambiaste tu contraseña",
          fecha: "1 de Abril, 2025 - 09:15",
        },
        {
          id: "5",
          tipo: "correo",
          descripcion: "Actualizaste tu correo electrónico",
          fecha: "20 de Marzo, 2025 - 11:30",
        },
        {
          id: "6",
          tipo: "notificaciones",
          descripcion: "Modificaste tus preferencias de notificaciones",
          fecha: "15 de Marzo, 2025 - 17:45",
        },
        {
          id: "7",
          tipo: "evento",
          descripcion: "Cancelaste tu registro al evento 'Workshop de UX/UI'",
          fecha: "10 de Marzo, 2025 - 13:20",
        },
      ]

      setActividades(actividadesData)
      setCargando(false)
    }, 1000) // Simular tiempo de carga
  }, [])

  // Filtrar actividades según el tipo seleccionado
  const actividadesFiltradas = actividades.filter((actividad) => {
    if (filtroTipo === "todos") return true
    return actividad.tipo === filtroTipo
  })

  // Obtener el icono según el tipo de actividad
  const getIcono = (tipo: string) => {
    switch (tipo) {
      case "evento":
        return <Calendar size={16} className="text-[#38A2C1]" />
      case "constancia":
        return <Award size={16} className="text-[#8DC642]" />
      case "perfil":
        return <User size={16} className="text-[#41AD49]" />
      case "seguridad":
        return <Lock size={16} className="text-red-500" />
      case "correo":
        return <Mail size={16} className="text-purple-500" />
      case "notificaciones":
        return <Bell size={16} className="text-orange-500" />
      default:
        return <Clock size={16} className="text-gray-500" />
    }
  }

  if (cargando) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1C8443]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <Clock size={18} className="mr-2 text-[#41AD49]" />
          <h2 className="text-lg font-bold text-[#1C8443]">Historial de Actividad</h2>
        </div>

        <div className="flex items-center">
          <Filter size={16} className="text-gray-500 mr-2" />
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#67DCD7]"
          >
            <option value="todos">Todas las actividades</option>
            <option value="evento">Eventos</option>
            <option value="constancia">Constancias</option>
            <option value="perfil">Perfil</option>
            <option value="seguridad">Seguridad</option>
            <option value="correo">Correo</option>
            <option value="notificaciones">Notificaciones</option>
          </select>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {actividadesFiltradas.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No hay actividades registradas para el filtro seleccionado.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {actividadesFiltradas.map((actividad) => (
              <li key={actividad.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      {getIcono(actividad.tipo)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">{actividad.descripcion}</p>
                    <p className="text-xs text-gray-500 mt-1">{actividad.fecha}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default HistorialActividad
