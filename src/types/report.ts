export interface ReportCategory {
  id: string
  name: string
  description: string
  icon: string
  reports: Report[]
}

export interface Report {
  id: string
  categoryId: string
  name: string
  description: string
  type: "table" | "chart" | "mixed"
  chartType?: "bar" | "line" | "pie" | "area" | "radar" | "scatter"
  parameters: ReportParameter[]
  columns?: ReportColumn[]
  defaultDateRange?: "today" | "yesterday" | "thisWeek" | "lastWeek" | "thisMonth" | "lastMonth" | "thisYear" | "custom"
}

export interface ReportParameter {
  id: string
  name: string
  label: string
  type: "string" | "number" | "boolean" | "date" | "dateRange" | "select" | "multiSelect"
  required: boolean
  defaultValue?: any
  options?: { value: string; label: string }[]
  placeholder?: string
  description?: string
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

export interface ReportColumn {
  id: string
  key: string
  label: string
  type: "string" | "number" | "date" | "boolean" | "status" | "user" | "action"
  format?: string
  sortable?: boolean
  filterable?: boolean
  width?: string
}

export interface ReportData {
  columns: ReportColumn[]
  rows: any[]
  summary?: Record<string, any>
  chartData?: any
}

export interface ScheduledReport {
  id: string
  reportId: string
  name: string
  parameters: Record<string, any>
  schedule: {
    frequency: "daily" | "weekly" | "monthly" | "custom"
    dayOfWeek?: number // 0-6, donde 0 es domingo
    dayOfMonth?: number // 1-31
    time: string // HH:MM
    customCron?: string
  }
  format: "pdf" | "excel" | "csv" | "json"
  recipients: {
    emails: string[]
    users: string[]
  }
  active: boolean
  lastRun?: string
  nextRun?: string
  createdBy: string
  createdAt: string
}

export interface ReportExportOptions {
  format: "pdf" | "excel" | "csv" | "json"
  includeCharts: boolean
  orientation?: "portrait" | "landscape"
  pageSize?: "a4" | "letter" | "legal"
  fileName?: string
}
