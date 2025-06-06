"use client"

import type React from "react"
import { useState } from "react"

interface ReportConfig {
  type: string
  event: string
  dateRange: {
    start: string
    end: string
  }
  format: string
  includeGraphics: boolean
  includeDetails: boolean
}

export const Reportes: React.FC = () => {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    type: "",
    event: "",
    dateRange: {
      start: "",
      end: "",
    },
    format: "pdf",
    includeGraphics: true,
    includeDetails: false,
  })

  const [showPreview, setShowPreview] = useState(false)
  const [scheduledReports, setScheduledReports] = useState([
    {
      id: 1,
      name: "Reporte Mensual de Asistencia",
      type: "Asistencia",
      frequency: "Mensual",
      nextRun: "2024-01-01",
      status: "Activo",
    },
    {
      id: 2,
      name: "Reporte Semanal de Eventos",
      type: "Eventos",
      frequency: "Semanal",
      nextRun: "2024-12-16",
      status: "Activo",
    },
  ])

  const reportTypes = [
    { value: "attendance", label: "Reporte de Asistencia" },
    { value: "events", label: "Reporte de Eventos" },
    { value: "certificates", label: "Reporte de Constancias" },
    { value: "revenue", label: "Reporte Financiero" },
    { value: "satisfaction", label: "Reporte de Satisfacción" },
  ]

  const events = [
    "Todos los eventos",
    "Conferencia de Tecnología 2024",
    "Workshop de Desarrollo Web",
    "Seminario de IA",
  ]

  const formats = [
    { value: "pdf", label: "PDF" },
    { value: "excel", label: "Excel" },
    { value: "csv", label: "CSV" },
    { value: "word", label: "Word" },
  ]

  const handleConfigChange = (field: keyof ReportConfig, value: any) => {
    setReportConfig((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDateRangeChange = (field: "start" | "end", value: string) => {
    setReportConfig((prev) => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value,
      },
    }))
  }

  const generateReport = () => {
    console.log("Generando reporte:", reportConfig)
    setShowPreview(true)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
          <p className="text-gray-600 mt-2">Genera y programa reportes personalizados</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Type Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuración del Reporte</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Reporte</label>
                  <select
                    value={reportConfig.type}
                    onChange={(e) => handleConfigChange("type", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
                  >
                    <option value="">Seleccionar tipo</option>
                    {reportTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Evento</label>
                  <select
                    value={reportConfig.event}
                    onChange={(e) => handleConfigChange("event", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
                  >
                    <option value="">Seleccionar evento</option>
                    {events.map((event) => (
                      <option key={event} value={event}>
                        {event}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio</label>
                  <input
                    type="date"
                    value={reportConfig.dateRange.start}
                    onChange={(e) => handleDateRangeChange("start", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Fin</label>
                  <input
                    type="date"
                    value={reportConfig.dateRange.end}
                    onChange={(e) => handleDateRangeChange("end", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C8443] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Formato de Exportación</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {formats.map((format) => (
                    <label key={format.value} className="flex items-center">
                      <input
                        type="radio"
                        name="format"
                        value={format.value}
                        checked={reportConfig.format === format.value}
                        onChange={(e) => handleConfigChange("format", e.target.value)}
                        className="mr-2 text-[#1C8443] focus:ring-[#1C8443]"
                      />
                      <span className="text-sm">{format.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reportConfig.includeGraphics}
                    onChange={(e) => handleConfigChange("includeGraphics", e.target.checked)}
                    className="mr-2 text-[#1C8443] focus:ring-[#1C8443]"
                  />
                  <span className="text-sm">Incluir gráficos y visualizaciones</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reportConfig.includeDetails}
                    onChange={(e) => handleConfigChange("includeDetails", e.target.checked)}
                    className="mr-2 text-[#1C8443] focus:ring-[#1C8443]"
                  />
                  <span className="text-sm">Incluir detalles individuales</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={generateReport}
                  disabled={!reportConfig.type}
                  className="px-6 py-3 bg-[#1C8443] text-white rounded-lg hover:bg-[#41AD49] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  📊 Generar Reporte
                </button>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-6 py-3 bg-[#38A2C1] text-white rounded-lg hover:bg-[#67DCD7] transition-colors"
                >
                  👁️ Vista Previa
                </button>
                <button className="px-6 py-3 bg-[#8DC642] text-white rounded-lg hover:bg-[#41AD49] transition-colors">
                  ⏰ Programar Reporte
                </button>
              </div>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa del Reporte</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="space-y-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {reportTypes.find((t) => t.value === reportConfig.type)?.label || "Reporte"}
                    </div>
                    <div className="text-gray-600">Evento: {reportConfig.event || "No seleccionado"}</div>
                    <div className="text-gray-600">
                      Período: {reportConfig.dateRange.start || "No definido"} -{" "}
                      {reportConfig.dateRange.end || "No definido"}
                    </div>
                    <div className="text-gray-600">
                      Formato: {formats.find((f) => f.value === reportConfig.format)?.label}
                    </div>
                    <div className="mt-6 p-4 bg-gray-50 rounded">
                      <p className="text-sm text-gray-700">
                        Este es un ejemplo de cómo se verá tu reporte. Los datos reales se generarán cuando hagas clic
                        en "Generar Reporte".
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scheduled Reports */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reportes Programados</h3>
              <div className="space-y-4">
                {scheduledReports.map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{report.name}</h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          report.status === "Activo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Tipo: {report.type}</p>
                      <p>Frecuencia: {report.frequency}</p>
                      <p>Próxima ejecución: {new Date(report.nextRun).toLocaleDateString("es-ES")}</p>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <button className="text-[#1C8443] hover:text-[#41AD49] text-sm">✏️ Editar</button>
                      <button className="text-red-600 hover:text-red-800 text-sm">🗑️ Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 px-4 bg-[#8DC642] text-white rounded-lg hover:bg-[#41AD49] transition-colors">
                ➕ Nuevo Reporte Programado
              </button>
            </div>

            {/* Quick Reports */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reportes Rápidos</h3>
              <div className="space-y-3">
                <button className="w-full py-2 px-4 bg-[#1C8443] text-white rounded-lg hover:bg-[#41AD49] transition-colors text-left">
                  📊 Asistencia del Mes
                </button>
                <button className="w-full py-2 px-4 bg-[#38A2C1] text-white rounded-lg hover:bg-[#67DCD7] transition-colors text-left">
                  🏆 Constancias Emitidas
                </button>
                <button className="w-full py-2 px-4 bg-[#8DC642] text-white rounded-lg hover:bg-[#41AD49] transition-colors text-left">
                  📅 Eventos Completados
                </button>
                <button className="w-full py-2 px-4 bg-[#67DCD7] text-white rounded-lg hover:bg-[#38A2C1] transition-colors text-left">
                  💰 Resumen Financiero
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
