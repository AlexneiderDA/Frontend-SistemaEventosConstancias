"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {OrganizadorLayout} from "../../components/organizador/OrganizadorLayout"


interface MetricData {
  time: string
  entries: number
  currentAttendance: number
}

export const MetricasTiempoReal: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState("Conferencia de Tecnología 2024")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLive, setIsLive] = useState(true)

  // Simulated real-time data
  const [metrics, setMetrics] = useState({
    currentAttendance: 87,
    totalRegistered: 120,
    entriesLastHour: 23,
    averageStayTime: "2h 15min",
    attendanceRate: 72.5,
  })

  const events = ["Conferencia de Tecnología 2024", "Workshop de Desarrollo Web", "Seminario de IA"]

  // Simulated hourly entry data
  const hourlyData: MetricData[] = [
    { time: "08:00", entries: 5, currentAttendance: 5 },
    { time: "09:00", entries: 25, currentAttendance: 28 },
    { time: "10:00", entries: 15, currentAttendance: 40 },
    { time: "11:00", entries: 12, currentAttendance: 50 },
    { time: "12:00", entries: 8, currentAttendance: 45 },
    { time: "13:00", entries: 20, currentAttendance: 60 },
    { time: "14:00", entries: 18, currentAttendance: 75 },
    { time: "15:00", entries: 12, currentAttendance: 87 },
  ]

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())

      // Simulate real-time updates
      if (isLive) {
        setMetrics((prev) => ({
          ...prev,
          currentAttendance: prev.currentAttendance + Math.floor(Math.random() * 3) - 1,
          entriesLastHour: prev.entriesLastHour + Math.floor(Math.random() * 2),
        }))
      }
    }, 5000)

    return () => clearInterval(timer)
  }, [isLive])

  const attendancePercentage = (metrics.currentAttendance / metrics.totalRegistered) * 100

  return (
    <OrganizadorLayout title="Métricas en Tiempo Real">
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Métricas en Tiempo Real</h1>
            <p className="text-gray-600 mt-2">Monitoreo en vivo de la asistencia a eventos</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></div>
              <span className="text-sm font-medium">{isLive ? "EN VIVO" : "PAUSADO"}</span>
            </div>
            <button
              onClick={() => setIsLive(!isLive)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isLive ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {isLive ? "⏸️ Pausar" : "▶️ Reanudar"}
            </button>
          </div>
        </div>

        {/* Event Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Evento Seleccionado</label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
              >
                {events.map((event) => (
                  <option key={event} value={event}>
                    {event}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Última actualización</div>
              <div className="text-lg font-medium text-gray-900">{currentTime.toLocaleTimeString("es-ES")}</div>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Asistencia Actual</p>
                <p className="text-3xl font-bold text-[#1C8443] mt-1">{metrics.currentAttendance}</p>
                <p className="text-sm text-gray-500">de {metrics.totalRegistered} registrados</p>
              </div>
              <div className="p-3 rounded-full bg-gradient-to-r from-[#1C8443] to-[#41AD49]">
                <span className="text-white text-xl">👥</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-[#41AD49] h-3 rounded-full transition-all duration-500"
                  style={{ width: `${attendancePercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{attendancePercentage.toFixed(1)}% de asistencia</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Entradas Última Hora</p>
                <p className="text-3xl font-bold text-[#38A2C1] mt-1">{metrics.entriesLastHour}</p>
                <p className="text-sm text-green-600">↗ +3 vs hora anterior</p>
              </div>
              <div className="p-3 rounded-full bg-gradient-to-r from-[#38A2C1] to-[#67DCD7]">
                <span className="text-white text-xl">🚪</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">% de Asistencia</p>
                <p className="text-3xl font-bold text-[#8DC642] mt-1">{metrics.attendanceRate}%</p>
                <p className="text-sm text-green-600">↗ +2.3% vs esperado</p>
              </div>
              <div className="p-3 rounded-full bg-gradient-to-r from-[#8DC642] to-[#41AD49]">
                <span className="text-white text-xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tiempo Promedio</p>
                <p className="text-3xl font-bold text-[#67DCD7] mt-1">{metrics.averageStayTime}</p>
                <p className="text-sm text-gray-500">permanencia</p>
              </div>
              <div className="p-3 rounded-full bg-gradient-to-r from-[#67DCD7] to-[#38A2C1]">
                <span className="text-white text-xl">⏱️</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Asistencia vs Registrados</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Asistencia Actual</span>
                <span className="text-lg font-bold text-[#1C8443]">{metrics.currentAttendance}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-[#1C8443] h-4 rounded-full transition-all duration-500"
                  style={{ width: `${attendancePercentage}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Registrados</span>
                <span className="text-lg font-bold text-gray-700">{metrics.totalRegistered}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-gray-400 h-4 rounded-full" style={{ width: "100%" }}></div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Meta de asistencia: 80%</span>
                  <span className={`font-medium ${attendancePercentage >= 80 ? "text-green-600" : "text-yellow-600"}`}>
                    {attendancePercentage >= 80 ? "✅ Alcanzada" : "⏳ En progreso"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Hourly Entries Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Entradas por Hora</h3>
            <div className="space-y-3">
              {hourlyData.map((data, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-600 w-12">{data.time}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700">{data.entries} entradas</span>
                      <span className="text-sm text-gray-500">{data.currentAttendance} total</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#38A2C1] h-2 rounded-full"
                        style={{ width: `${(data.entries / 25) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button className="px-6 py-3 bg-[#1C8443] text-white rounded-lg hover:bg-[#41AD49] transition-colors">
            📊 Exportar Datos
          </button>
          <button className="px-6 py-3 bg-[#38A2C1] text-white rounded-lg hover:bg-[#67DCD7] transition-colors">
            📈 Comparar Eventos
          </button>
          <button className="px-6 py-3 bg-[#8DC642] text-white rounded-lg hover:bg-[#41AD49] transition-colors">
            📧 Enviar Reporte
          </button>
        </div>
      </div>
    </div>
    </OrganizadorLayout>
  )
}
