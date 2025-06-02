export interface SystemSetting {
  id: string
  key: string
  value: string | number | boolean
  type: "string" | "number" | "boolean" | "select" | "email" | "url" | "color" | "textarea"
  category: SettingCategory
  label: string
  description?: string
  options?: { value: string; label: string }[]
  isAdvanced?: boolean
  validation?: {
    required?: boolean
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

export type SettingCategory = "general" | "security" | "notifications" | "appearance" | "advanced"

export interface ScheduledTask {
  id: string
  name: string
  description?: string
  command: string
  schedule: string
  lastRun?: string
  nextRun?: string
  status: "active" | "paused" | "error"
  createdAt: string
  updatedAt: string
  logs?: TaskLog[]
}

export interface TaskLog {
  id: string
  taskId: string
  timestamp: string
  status: "success" | "error" | "warning" | "info"
  message: string
}

export interface BackupConfig {
  enabled: boolean
  frequency: "daily" | "weekly" | "monthly" | "custom"
  customCron?: string
  retention: number
  location: "local" | "cloud"
  cloudProvider?: "s3" | "dropbox" | "google" | "azure"
  cloudSettings?: Record<string, string>
  includeUploads: boolean
  includeDatabase: boolean
  lastBackup?: string
  nextBackup?: string
}

export interface EmailConfig {
  provider: "smtp" | "sendgrid" | "mailgun" | "ses" | "none"
  fromEmail: string
  fromName: string
  smtpHost?: string
  smtpPort?: number
  smtpUser?: string
  smtpPassword?: string
  apiKey?: string
  domain?: string
  region?: string
}

export interface LoggingConfig {
  level: "error" | "warning" | "info" | "debug" | "trace"
  retention: number
  enableFileLogging: boolean
  logPath?: string
  enableRemoteLogging: boolean
  remoteEndpoint?: string
}
