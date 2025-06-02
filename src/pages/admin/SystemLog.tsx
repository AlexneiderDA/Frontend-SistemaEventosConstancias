"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { RefreshCw, BarChart } from "lucide-react"
import { AdminLayout } from "@/components/layouts/AdminLayout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogFilters } from "@/components/system-log/LogFilters"
import { LogTable } from "@/components/system-log/LogTable"
import { LogDetails } from "@/components/system-log/LogDetails"
import { LogStats } from "@/components/system-log/LogStats"
import { MaintenanceTools } from "@/components/system-log/MaintenanceTools"
import { ExportOptions } from "@/components/system-log/ExportOptions"
import type { SystemLogEntry, SystemLogFilter, SystemLogStats } from "@/types/system-log"

// Datos de ejemplo
const mockUsers = [
  { id: "1", name: "Admin Usuario" },
  { id: "2", name: "Juan Pérez" },
  { id: "3", name: "María García" },
  { id: "4", name: "Carlos López" },
]

const mockActions = [
  "Inicio de sesión",
  "Cierre de sesión",
  "Crear",
  "Actualizar",
  "Eliminar",
  "Exportar",
  "Importar",
  "Generar reporte",
  "Cambiar configuración",
]

const mockModules = [
  "Usuarios",
  "Roles",
  "Eventos",
  "Constancias",
  "Configuración",
  "Reportes",
  "Plantillas",
  "Autenticación",
  "Sistema",
]

// Generar datos de ejemplo para la bitácora
const generateMockLogs = (count: number): SystemLogEntry[] => {
  const logs: SystemLogEntry[] = []
  const statuses: ("success" | "warning" | "error" | "info")[] = ["success", "warning", "error", "info"]

  for (let i = 0; i < count; i++) {
    const userId = mockUsers[Math.floor(Math.random() * mockUsers.length)].id
    const userName = mockUsers.find((u) => u.id === userId)?.name || "Usuario Desconocido"
    const action = mockActions[Math.floor(Math.random() * mockActions.length)]
    const module = mockModules[Math.floor(Math.random() * mockModules.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const timestamp = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString()
    const duration = Math.floor(Math.random() * 5000)

    logs.push({
      id: `log-${i + 1}`,
      timestamp,
      userId,
      userName,
      action,
      module,
      description: `${userName} realizó la acción "${action}" en el módulo "${module}"`,
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      details: {
        browser: ["Chrome", "Firefox", "Safari", "Edge"][Math.floor(Math.random() * 4)],
        os: ["Windows", "MacOS", "Linux", "iOS", "Android"][Math.floor(Math.random() * 5)],
        requestData: {
          method: ["GET", "POST", "PUT", "DELETE"][Math.floor(Math.random() * 4)],
          path: `/api/${module.toLowerCase()}/${action.toLowerCase().replace(/ /g, "-")}`,
          params: { id: `${Math.floor(Math.random() * 1000)}` },
        },
        responseData: {
          status: status === "error" ? 500 : status === "warning" ? 400 : 200,
          message:
            status === "error"
              ? "Error interno del servidor"
              : status === "warning"
                ? "Solicitud incorrecta"
                : "Operación exitosa",
        },
      },
      status,
      duration,
    })
  }

  return logs
}

// Generar estadísticas de ejemplo
const generateMockStats = (logs: SystemLogEntry[]): SystemLogStats => {
  const successCount = logs.filter((log) => log.status === "success").length
  const warningCount = logs.filter((log) => log.status === "warning").length
  const errorCount = logs.filter((log) => log.status === "error").length
  const infoCount = logs.filter((log) => log.status === "info").length

  // Calcular duración promedio
  const totalDuration = logs.reduce((sum, log) => sum + (log.duration || 0), 0)
  const averageDuration = logs.length > 0 ? totalDuration / logs.length : 0

  // Calcular módulos más usados
  const moduleCount: Record<string, number> = {}
  logs.forEach((log) => {
    moduleCount[log.module] = (moduleCount[log.module] || 0) + 1
  })

  const topModules = Object.entries(moduleCount)
    .map(([module, count]) => ({ module, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Calcular usuarios más activos
  const userCount: Record<string, { userId: string; userName: string; count: number }> = {}
  logs.forEach((log) => {
    if (!userCount[log.userId]) {
      userCount[log.userId] = { userId: log.userId, userName: log.userName, count: 0 }
    }
    userCount[log.userId].count += 1
  })

  const topUsers = Object.values(userCount)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Calcular acciones más frecuentes
  const actionCount: Record<string, number> = {}
  logs.forEach((log) => {
    actionCount[log.action] = (actionCount[log.action] || 0) + 1
  })

  const topActions = Object.entries(actionCount)
    .map(([action, count]) => ({ action, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return {
    totalEntries: logs.length,
    successCount,
    warningCount,
    errorCount,
    infoCount,
    averageDuration,
    topModules,
    topUsers,
    topActions,
  }
}

const mockLogs = generateMockLogs(100)
const mockStats = generateMockStats(mockLogs)

export const SystemLog: React.FC = () => {
  const [activeTab, setActiveTab] = useState("logs")
  const [logs, setLogs] = useState<SystemLogEntry[]>(mockLogs)
  const [filteredLogs, setFilteredLogs] = useState<SystemLogEntry[]>(mockLogs)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedLog, setSelectedLog] = useState<SystemLogEntry | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [filters, setFilters] = useState<SystemLogFilter>({})
  const [stats, setStats] = useState<SystemLogStats>(mockStats)
  const [sortColumn, setSortColumn] = useState<keyof SystemLogEntry>("timestamp")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isLoading, setIsLoading] = useState(false)

  // Aplicar filtros y ordenamiento
  useEffect(() => {
    setIsLoading(true)

    // Simular tiempo de carga
    setTimeout(() => {
      let result = [...logs]

      // Aplicar filtros
      if (filters.startDate) {
        result = result.filter((log) => new Date(log.timestamp) >= new Date(filters.startDate!))
      }

      if (filters.endDate) {
        result = result.filter((log) => new Date(log.timestamp) <= new Date(filters.endDate!))
      }

      if (filters.userId) {
        result = result.filter((log) => log.userId === filters.userId)
      }

      if (filters.action) {
        result = result.filter((log) => log.action === filters.action)
      }

      if (filters.module) {
        result = result.filter((log) => log.module === filters.module)
      }

      if (filters.status) {
        result = result.filter((log) => log.status === filters.status)
      }

      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        result = result.filter(
          (log) =>
            log.userName.toLowerCase().includes(searchLower) ||
            log.action.toLowerCase().includes(searchLower) ||
            log.module.toLowerCase().includes(searchLower) ||
            log.description.toLowerCase().includes(searchLower) ||
            log.ipAddress.toLowerCase().includes(searchLower),
        )
      }

      // Aplicar ordenamiento
      result.sort((a, b) => {
        const valueA = a[sortColumn]
        const valueB = b[sortColumn]

        if (typeof valueA === "string" && typeof valueB === "string") {
          return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
        }

        // Para valores numéricos o fechas
        if (valueA && valueB) {
          return sortDirection === "asc" ? (valueA < valueB ? -1 : 1) : valueA > valueB ? -1 : 1
        }

        return 0
      })

      setFilteredLogs(result)
      setCurrentPage(1)
      setStats(generateMockStats(result))
      setIsLoading(false)
    }, 500)
  }, [logs, filters, sortColumn, sortDirection])

  // Obtener logs para la página actual
  const getCurrentPageLogs = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredLogs.slice(startIndex, startIndex + itemsPerPage)
  }

  // Manejadores de eventos
  const handleFilterChange = (newFilters: SystemLogFilter) => {
    setFilters(newFilters)
  }

  const handleResetFilters = () => {
    setFilters({})
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleViewDetails = (log: SystemLogEntry) => {
    setSelectedLog(log)
    setDetailsOpen(true)
  }

  const handleSort = (column: keyof SystemLogEntry) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleExportLog = (log: SystemLogEntry) => {
    console.log("Exportando registro:", log.id)
    // En una aplicación real, aquí se generaría y descargaría el archivo
    alert(`Registro ${log.id} exportado correctamente.`)
  }

  const handleExportFiltered = (format: string, includeDetails: boolean, dateRange: { from?: Date; to?: Date }) => {
    console.log("Exportando registros filtrados:", {
      format,
      includeDetails,
      dateRange,
      totalRecords: filteredLogs.length,
    })
    // En una aplicación real, aquí se generaría y descargaría el archivo
    alert(`${filteredLogs.length} registros exportados en formato ${format}.`)
  }

  const handlePurgeOldLogs = async (days: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - days)

        const newLogs = logs.filter((log) => new Date(log.timestamp) >= cutoffDate)
        setLogs(newLogs)

        resolve()
      }, 2000)
    })
  }

  const handleClearLogs = async (type: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (type === "all") {
          setLogs([])
        } else {
          const newLogs = logs.filter((log) => log.status !== type)
          setLogs(newLogs)
        }

        resolve()
      }, 2000)
    })
  }

  const handleOptimizeDatabase = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Simulación de optimización
        resolve()
      }, 3000)
    })
  }

  const handleExportAllLogs = () => {
    console.log("Exportando todos los registros")
    // En una aplicación real, aquí se generaría y descargaría el archivo
    alert(`${logs.length} registros exportados correctamente.`)
  }

  const handleRefresh = () => {
    setIsLoading(true)

    // Simular recarga de datos
    setTimeout(() => {
      const newLogs = generateMockLogs(100)
      setLogs(newLogs)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <AdminLayout title="Bitácora del Sistema">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Bitácora del Sistema</h1>
            <p className="text-muted-foreground">Registro de todas las actividades y eventos del sistema</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
            <ExportOptions onExport={handleExportFiltered} currentFilters={filters} />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="logs">Registros</TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center">
              <BarChart className="mr-2 h-4 w-4" />
              Estadísticas
            </TabsTrigger>
            <TabsTrigger value="maintenance">Mantenimiento</TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-4">
            <LogFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              users={mockUsers}
              actions={mockActions}
              modules={mockModules}
            />

            <LogTable
              logs={getCurrentPageLogs()}
              currentPage={currentPage}
              totalPages={Math.ceil(filteredLogs.length / itemsPerPage)}
              onPageChange={handlePageChange}
              onViewDetails={handleViewDetails}
              onSort={handleSort}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
            />
          </TabsContent>

          <TabsContent value="stats">
            <LogStats stats={stats} />
          </TabsContent>

          <TabsContent value="maintenance">
            <MaintenanceTools
              onPurgeOldLogs={handlePurgeOldLogs}
              onClearLogs={handleClearLogs}
              onOptimizeDatabase={handleOptimizeDatabase}
              onExportAllLogs={handleExportAllLogs}
            />
          </TabsContent>
        </Tabs>

        <LogDetails log={selectedLog} open={detailsOpen} onOpenChange={setDetailsOpen} onExport={handleExportLog} />
      </div>
    </AdminLayout>
  )
}
