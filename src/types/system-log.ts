export interface SystemLogEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: string
  module: string
  description: string
  ipAddress: string
  details: Record<string, any>
  status: "success" | "warning" | "error" | "info"
  duration?: number // en milisegundos
}

export interface SystemLogFilter {
  startDate?: string
  endDate?: string
  userId?: string
  action?: string
  module?: string
  status?: "success" | "warning" | "error" | "info"
  searchTerm?: string
}

export interface SystemLogStats {
  totalEntries: number
  successCount: number
  warningCount: number
  errorCount: number
  infoCount: number
  averageDuration: number
  topModules: { module: string; count: number }[]
  topUsers: { userId: string; userName: string; count: number }[]
  topActions: { action: string; count: number }[]
}
