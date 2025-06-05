"use client"

import type React from "react"
import { useState } from "react"
import { SettingsIcon, Sliders, Bell, Mail, Database, FileText, Clock, Shield, Palette } from "lucide-react"
import { Switch } from "../../components/ui/switch"
import { Label } from "../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { AdminLayout } from "../../components/admin/layouts/AdminLayout"
import { SettingsForm } from "../../components/admin/settings/SettingsForm"
import { TaskScheduler } from "../../components/admin/settings/TaskScheduler"
import { BackupSettings } from "../../components/admin/settings/BackupSettings"
import { EmailSettings } from "../../components/admin/settings/EmailSettings"
import { LoggingSettings } from "../../components/admin/settings/LoggingSettings"
import type { SystemSetting, ScheduledTask, BackupConfig, EmailConfig, LoggingConfig, TaskLog } from "../../types/settings"


const mockGeneralSettings: SystemSetting[] = [
  {
    id: "1",
    key: "site_name",
    value: "Sistema de Eventos y Constancias",
    type: "string",
    category: "general",
    label: "Nombre del sitio",
    description: "Nombre que se mostrará en el título de la página y en los correos electrónicos",
    validation: {
      required: true,
      message: "El nombre del sitio es obligatorio",
    },
  },
  {
    id: "2",
    key: "site_description",
    value: "Plataforma para la gestión de eventos y emisión de constancias",
    type: "textarea",
    category: "general",
    label: "Descripción del sitio",
    description: "Breve descripción del propósito del sitio",
  },
  {
    id: "3",
    key: "contact_email",
    value: "contacto@ejemplo.com",
    type: "email",
    category: "general",
    label: "Correo de contacto",
    description: "Dirección de correo electrónico para contacto",
    validation: {
      required: true,
      pattern: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
      message: "Ingrese una dirección de correo electrónico válida",
    },
  },
  {
    id: "4",
    key: "timezone",
    value: "America/Mexico_City",
    type: "select",
    category: "general",
    label: "Zona horaria",
    description: "Zona horaria para mostrar fechas y horas",
    options: [
      { value: "America/Mexico_City", label: "Ciudad de México (UTC-6)" },
      { value: "America/Cancun", label: "Cancún (UTC-5)" },
      { value: "America/Tijuana", label: "Tijuana (UTC-8)" },
      { value: "UTC", label: "UTC" },
    ],
  },
  {
    id: "5",
    key: "date_format",
    value: "DD/MM/YYYY",
    type: "select",
    category: "general",
    label: "Formato de fecha",
    description: "Formato para mostrar fechas en el sistema",
    options: [
      { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
      { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
      { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
      { value: "DD-MM-YYYY", label: "DD-MM-YYYY" },
    ],
  },
  {
    id: "6",
    key: "items_per_page",
    value: 10,
    type: "number",
    category: "general",
    label: "Elementos por página",
    description: "Número de elementos a mostrar en las tablas paginadas",
    validation: {
      required: true,
      min: 5,
      max: 100,
      message: "El valor debe estar entre 5 y 100",
    },
  },
]

const mockSecuritySettings: SystemSetting[] = [
  {
    id: "7",
    key: "enable_registration",
    value: true,
    type: "boolean",
    category: "security",
    label: "Permitir registro de usuarios",
    description: "Habilitar el registro público de nuevos usuarios",
  },
  {
    id: "8",
    key: "require_email_verification",
    value: true,
    type: "boolean",
    category: "security",
    label: "Requerir verificación de correo",
    description: "Los usuarios deben verificar su correo electrónico antes de iniciar sesión",
  },
  {
    id: "9",
    key: "password_min_length",
    value: 8,
    type: "number",
    category: "security",
    label: "Longitud mínima de contraseña",
    description: "Número mínimo de caracteres para las contraseñas",
    validation: {
      required: true,
      min: 6,
      max: 32,
      message: "El valor debe estar entre 6 y 32",
    },
  },
  {
    id: "10",
    key: "password_require_special",
    value: true,
    type: "boolean",
    category: "security",
    label: "Requerir caracteres especiales",
    description: "Las contraseñas deben incluir al menos un carácter especial",
  },
  {
    id: "11",
    key: "session_timeout",
    value: 60,
    type: "number",
    category: "security",
    label: "Tiempo de sesión (minutos)",
    description: "Tiempo de inactividad antes de cerrar la sesión",
    validation: {
      required: true,
      min: 5,
      max: 1440,
      message: "El valor debe estar entre 5 y 1440 minutos",
    },
  },
  {
    id: "12",
    key: "max_login_attempts",
    value: 5,
    type: "number",
    category: "security",
    label: "Intentos máximos de inicio de sesión",
    description: "Número de intentos fallidos antes de bloquear la cuenta",
    validation: {
      required: true,
      min: 3,
      max: 10,
      message: "El valor debe estar entre 3 y 10",
    },
  },
  {
    id: "13",
    key: "enable_2fa",
    value: false,
    type: "boolean",
    category: "security",
    label: "Habilitar autenticación de dos factores",
    description: "Permitir a los usuarios configurar 2FA para mayor seguridad",
  },
  {
    id: "14",
    key: "jwt_secret",
    value: "your-secret-key-here",
    type: "string",
    category: "security",
    label: "Clave secreta JWT",
    description: "Clave para firmar los tokens JWT (no compartir)",
    isAdvanced: true,
  },
]

const mockNotificationSettings: SystemSetting[] = [
  {
    id: "15",
    key: "enable_email_notifications",
    value: true,
    type: "boolean",
    category: "notifications",
    label: "Habilitar notificaciones por correo",
    description: "Enviar notificaciones por correo electrónico a los usuarios",
  },
  {
    id: "16",
    key: "enable_browser_notifications",
    value: true,
    type: "boolean",
    category: "notifications",
    label: "Habilitar notificaciones del navegador",
    description: "Mostrar notificaciones en el navegador para usuarios conectados",
  },
  {
    id: "17",
    key: "notify_on_registration",
    value: true,
    type: "boolean",
    category: "notifications",
    label: "Notificar al registrarse",
    description: "Enviar correo de bienvenida cuando un usuario se registra",
  },
  {
    id: "18",
    key: "notify_on_event_creation",
    value: true,
    type: "boolean",
    category: "notifications",
    label: "Notificar al crear evento",
    description: "Enviar notificación cuando se crea un nuevo evento",
  },
  {
    id: "19",
    key: "notify_on_certificate_issue",
    value: true,
    type: "boolean",
    category: "notifications",
    label: "Notificar al emitir constancia",
    description: "Enviar notificación cuando se emite una constancia",
  },
  {
    id: "20",
    key: "reminder_days_before",
    value: 2,
    type: "number",
    category: "notifications",
    label: "Días de anticipación para recordatorios",
    description: "Días antes del evento para enviar recordatorios",
    validation: {
      required: true,
      min: 1,
      max: 30,
      message: "El valor debe estar entre 1 y 30",
    },
  },
]

const mockAppearanceSettings: SystemSetting[] = [
  {
    id: "21",
    key: "primary_color",
    value: "#1C8443",
    type: "color",
    category: "appearance",
    label: "Color primario",
    description: "Color principal para botones y elementos destacados",
  },
  {
    id: "22",
    key: "secondary_color",
    value: "#41AD49",
    type: "color",
    category: "appearance",
    label: "Color secundario",
    description: "Color secundario para elementos de la interfaz",
  },
  {
    id: "23",
    key: "accent_color",
    value: "#67DCD7",
    type: "color",
    category: "appearance",
    label: "Color de acento",
    description: "Color para resaltar elementos específicos",
  },
  {
    id: "24",
    key: "logo_url",
    value: "/logo.png",
    type: "string",
    category: "appearance",
    label: "URL del logo",
    description: "URL de la imagen del logo del sitio",
  },
  {
    id: "25",
    key: "favicon_url",
    value: "/favicon.ico",
    type: "string",
    category: "appearance",
    label: "URL del favicon",
    description: "URL del icono de favoritos",
  },
  {
    id: "26",
    key: "enable_dark_mode",
    value: true,
    type: "boolean",
    category: "appearance",
    label: "Habilitar modo oscuro",
    description: "Permitir a los usuarios cambiar al modo oscuro",
  },
  {
    id: "27",
    key: "default_theme",
    value: "light",
    type: "select",
    category: "appearance",
    label: "Tema predeterminado",
    description: "Tema que se mostrará por defecto a los usuarios",
    options: [
      { value: "light", label: "Claro" },
      { value: "dark", label: "Oscuro" },
      { value: "system", label: "Según sistema" },
    ],
  },
  {
    id: "28",
    key: "custom_css",
    value: "",
    type: "textarea",
    category: "appearance",
    label: "CSS personalizado",
    description: "Código CSS adicional para personalizar la apariencia",
    isAdvanced: true,
  },
]

const mockAdvancedSettings: SystemSetting[] = [
  {
    id: "29",
    key: "maintenance_mode",
    value: false,
    type: "boolean",
    category: "advanced",
    label: "Modo de mantenimiento",
    description: "Activar el modo de mantenimiento (solo administradores pueden acceder)",
  },
  {
    id: "30",
    key: "debug_mode",
    value: false,
    type: "boolean",
    category: "advanced",
    label: "Modo de depuración",
    description: "Mostrar información detallada de errores y registros",
  },
  {
    id: "31",
    key: "api_rate_limit",
    value: 100,
    type: "number",
    category: "advanced",
    label: "Límite de tasa de API",
    description: "Número máximo de solicitudes por minuto a la API",
    validation: {
      required: true,
      min: 10,
      max: 1000,
      message: "El valor debe estar entre 10 y 1000",
    },
  },
  {
    id: "32",
    key: "cache_ttl",
    value: 3600,
    type: "number",
    category: "advanced",
    label: "Tiempo de vida de caché (segundos)",
    description: "Tiempo que los datos permanecen en caché",
    validation: {
      required: true,
      min: 60,
      max: 86400,
      message: "El valor debe estar entre 60 y 86400 segundos",
    },
  },
  {
    id: "33",
    key: "upload_max_size",
    value: 10,
    type: "number",
    category: "advanced",
    label: "Tamaño máximo de carga (MB)",
    description: "Tamaño máximo permitido para archivos subidos",
    validation: {
      required: true,
      min: 1,
      max: 100,
      message: "El valor debe estar entre 1 y 100 MB",
    },
  },
  {
    id: "34",
    key: "allowed_file_types",
    value: "jpg,jpeg,png,pdf,doc,docx,xls,xlsx,zip",
    type: "string",
    category: "advanced",
    label: "Tipos de archivo permitidos",
    description: "Lista separada por comas de extensiones de archivo permitidas",
  },
  {
    id: "35",
    key: "cors_origins",
    value: "*",
    type: "string",
    category: "advanced",
    label: "Orígenes CORS",
    description: "Dominios permitidos para CORS (separados por comas, * para todos)",
    isAdvanced: true,
  },
  {
    id: "36",
    key: "enable_api",
    value: true,
    type: "boolean",
    category: "advanced",
    label: "Habilitar API",
    description: "Permitir el acceso a la API del sistema",
  },
]

const mockTasks: ScheduledTask[] = [
  {
    id: "1",
    name: "Respaldo diario de la base de datos",
    description: "Crea una copia de seguridad completa de la base de datos",
    command: "php artisan db:backup --compress",
    schedule: "0 1 * * *",
    lastRun: "2023-05-10T01:00:00",
    nextRun: "2023-05-11T01:00:00",
    status: "active",
    createdAt: "2023-01-15T10:30:00",
    updatedAt: "2023-05-10T01:00:00",
    logs: [
      {
        id: "101",
        taskId: "1",
        timestamp: "2023-05-10T01:00:00",
        status: "success",
        message: "Backup completed successfully. Size: 24.5 MB",
      },
      {
        id: "102",
        taskId: "1",
        timestamp: "2023-05-09T01:00:00",
        status: "success",
        message: "Backup completed successfully. Size: 24.3 MB",
      },
      {
        id: "103",
        taskId: "1",
        timestamp: "2023-05-08T01:00:00",
        status: "warning",
        message: "Backup completed with warnings: Some tables were locked during backup",
      },
    ],
  },
  {
    id: "2",
    name: "Limpieza de archivos temporales",
    description: "Elimina archivos temporales y caché antiguo",
    command: "php artisan temp:clean --older-than=7",
    schedule: "0 3 * * 0",
    lastRun: "2023-05-07T03:00:00",
    nextRun: "2023-05-14T03:00:00",
    status: "active",
    createdAt: "2023-02-20T14:15:00",
    updatedAt: "2023-05-07T03:00:00",
    logs: [
      {
        id: "201",
        taskId: "2",
        timestamp: "2023-05-07T03:00:00",
        status: "success",
        message: "Cleaned 156 temporary files. Freed 78.2 MB of disk space.",
      },
    ],
  },
  {
    id: "3",
    name: "Envío de recordatorios de eventos",
    description: "Envía correos de recordatorio para eventos próximos",
    command: "php artisan events:send-reminders",
    schedule: "0 9 * * *",
    lastRun: "2023-05-10T09:00:00",
    nextRun: "2023-05-11T09:00:00",
    status: "active",
    createdAt: "2023-03-05T11:45:00",
    updatedAt: "2023-05-10T09:00:00",
    logs: [
      {
        id: "301",
        taskId: "3",
        timestamp: "2023-05-10T09:00:00",
        status: "success",
        message: "Sent 23 reminder emails for 3 upcoming events.",
      },
    ],
  },
  {
    id: "4",
    name: "Generación de informes mensuales",
    description: "Genera informes estadísticos mensuales",
    command: "php artisan reports:generate --type=monthly",
    schedule: "0 2 1 * *",
    lastRun: "2023-05-01T02:00:00",
    nextRun: "2023-06-01T02:00:00",
    status: "active",
    createdAt: "2023-01-10T09:20:00",
    updatedAt: "2023-05-01T02:00:00",
  },
  {
    id: "5",
    name: "Sincronización con sistema externo",
    description: "Sincroniza datos con el sistema de recursos humanos",
    command: "php artisan sync:external-system --target=hr",
    schedule: "0 */4 * * *",
    lastRun: "2023-05-10T20:00:00",
    nextRun: "2023-05-11T00:00:00",
    status: "error",
    createdAt: "2023-04-15T16:30:00",
    updatedAt: "2023-05-10T20:00:00",
    logs: [
      {
        id: "501",
        taskId: "5",
        timestamp: "2023-05-10T20:00:00",
        status: "error",
        message: "Connection timeout after 30 seconds. External system unavailable.",
      },
      {
        id: "502",
        taskId: "5",
        timestamp: "2023-05-10T16:00:00",
        status: "success",
        message: "Synchronized 45 records successfully.",
      },
    ],
  },
  {
    id: "6",
    name: "Actualización de índices de búsqueda",
    description: "Actualiza los índices de búsqueda para mejorar el rendimiento",
    command: "php artisan search:reindex",
    schedule: "0 4 * * *",
    lastRun: "2023-05-10T04:00:00",
    nextRun: "2023-05-11T04:00:00",
    status: "paused",
    createdAt: "2023-02-28T13:10:00",
    updatedAt: "2023-05-10T10:15:00",
  },
]

const mockBackupConfig: BackupConfig = {
  enabled: true,
  frequency: "daily",
  retention: 30,
  location: "local",
  includeUploads: true,
  includeDatabase: true,
  lastBackup: "2023-05-10T01:00:00",
  nextBackup: "2023-05-11T01:00:00",
}

const mockEmailConfig: EmailConfig = {
  provider: "smtp",
  fromEmail: "noreply@example.com",
  fromName: "Sistema de Eventos",
  smtpHost: "smtp.example.com",
  smtpPort: 587,
  smtpUser: "smtp_user",
  smtpPassword: "smtp_password",
}

const mockLoggingConfig: LoggingConfig = {
  level: "info",
  retention: 30,
  enableFileLogging: true,
  logPath: "/var/log/app",
  enableRemoteLogging: false,
}

const mockLogFiles: {
  id: string
  name: string
  size: string
  date: string
  type: "error" | "system" | "debug" | "access"
}[] = [
  {
    id: "1",
    name: "error.log",
    size: "1.2 MB",
    date: "2023-05-10",
    type: "error",
  },
  {
    id: "2",
    name: "access.log",
    size: "4.5 MB",
    date: "2023-05-10",
    type: "access",
  },
  {
    id: "3",
    name: "debug.log",
    size: "8.7 MB",
    date: "2023-05-10",
    type: "debug",
  },
  {
    id: "4",
    name: "system.log",
    size: "2.3 MB",
    date: "2023-05-10",
    type: "system",
  },
  {
    id: "5",
    name: "error.log.1",
    size: "1.1 MB",
    date: "2023-05-09",
    type: "error",
  },
  {
    id: "6",
    name: "access.log.1",
    size: "4.2 MB",
    date: "2023-05-09",
    type: "access",
  },
]

export const Settings: React.FC = () => {
  // Estado para pestañas
  const [activeTab, setActiveTab] = useState("general")
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Estado para configuraciones
  const [generalSettings, setGeneralSettings] = useState<SystemSetting[]>(mockGeneralSettings)
  const [securitySettings, setSecuritySettings] = useState<SystemSetting[]>(mockSecuritySettings)
  const [notificationSettings, setNotificationSettings] = useState<SystemSetting[]>(mockNotificationSettings)
  const [appearanceSettings, setAppearanceSettings] = useState<SystemSetting[]>(mockAppearanceSettings)
  const [advancedSettings, setAdvancedSettings] = useState<SystemSetting[]>(mockAdvancedSettings)
  const [tasks, setTasks] = useState<ScheduledTask[]>(mockTasks)
  const [backupConfig, setBackupConfig] = useState<BackupConfig>(mockBackupConfig)
  const [emailConfig, setEmailConfig] = useState<EmailConfig>(mockEmailConfig)
  const [loggingConfig, setLoggingConfig] = useState<LoggingConfig>(mockLoggingConfig)
  const [logFiles, setLogFiles] = useState(mockLogFiles)

  // Manejadores para configuraciones generales
  const handleSaveGeneralSettings = (settings: SystemSetting[]) => {
    setGeneralSettings(settings)
    console.log("Configuración general guardada:", settings)
  }

  const handleResetGeneralSettings = () => {
    setGeneralSettings(mockGeneralSettings)
  }

  // Manejadores para configuraciones de seguridad
  const handleSaveSecuritySettings = (settings: SystemSetting[]) => {
    setSecuritySettings(settings)
    console.log("Configuración de seguridad guardada:", settings)
  }

  const handleResetSecuritySettings = () => {
    setSecuritySettings(mockSecuritySettings)
  }

  // Manejadores para configuraciones de notificaciones
  const handleSaveNotificationSettings = (settings: SystemSetting[]) => {
    setNotificationSettings(settings)
    console.log("Configuración de notificaciones guardada:", settings)
  }

  const handleResetNotificationSettings = () => {
    setNotificationSettings(mockNotificationSettings)
  }

  // Manejadores para configuraciones de apariencia
  const handleSaveAppearanceSettings = (settings: SystemSetting[]) => {
    setAppearanceSettings(settings)
    console.log("Configuración de apariencia guardada:", settings)
  }

  const handleResetAppearanceSettings = () => {
    setAppearanceSettings(mockAppearanceSettings)
  }

  // Manejadores para configuraciones avanzadas
  const handleSaveAdvancedSettings = (settings: SystemSetting[]) => {
    setAdvancedSettings(settings)
    console.log("Configuración avanzada guardada:", settings)
  }

  const handleResetAdvancedSettings = () => {
    setAdvancedSettings(mockAdvancedSettings)
  }

  // Manejadores para tareas programadas
  const handleCreateTask = (task: Omit<ScheduledTask, "id" | "createdAt" | "updatedAt" | "lastRun" | "nextRun">) => {
    const newTask: ScheduledTask = {
      id: Date.now().toString(),
      ...task,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastRun: undefined,
      nextRun: undefined,
    }
    setTasks([...tasks, newTask])
    console.log("Tarea creada:", newTask)
  }

  const handleUpdateTask = (task: ScheduledTask) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return {
            ...task,
            updatedAt: new Date().toISOString(),
          }
        }
        return t
      }),
    )
    console.log("Tarea actualizada:", task)
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId))
    console.log("Tarea eliminada:", taskId)
  }

  const handleToggleTaskStatus = (taskId: string, active: boolean) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: active ? "active" : "paused",
            updatedAt: new Date().toISOString(),
          }
        }
        return t
      }),
    )
    console.log("Estado de tarea cambiado:", taskId, active)
  }

  const handleRunTaskNow = (taskId: string) => {
    const now = new Date().toISOString()
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          // Simular una ejecución exitosa
          const newLog: TaskLog = {
            id: Date.now().toString(),
            taskId,
            timestamp: now,
            status: "success",
            message: "Task executed manually by admin",
          }

          return {
            ...t,
            lastRun: now,
            updatedAt: now,
            logs: t.logs ? [newLog, ...t.logs] : [newLog],
          }
        }
        return t
      }),
    )
    console.log("Tarea ejecutada manualmente:", taskId)
  }

  // Manejadores para configuración de copias de seguridad
  const handleSaveBackupConfig = (config: BackupConfig) => {
    setBackupConfig(config)
    console.log("Configuración de copias de seguridad guardada:", config)
  }

  const handleRunBackup = () => {
    const now = new Date().toISOString()
    setBackupConfig({
      ...backupConfig,
      lastBackup: now,
      nextBackup: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Mañana
    })
    console.log("Copia de seguridad ejecutada manualmente")
  }

  const handleRestoreBackup = (file: File) => {
    console.log("Restaurando copia de seguridad desde archivo:", file.name)
    // En una aplicación real, aquí se procesaría el archivo
  }

  // Manejadores para configuración de correo electrónico
  const handleSaveEmailConfig = (config: EmailConfig) => {
    setEmailConfig(config)
    console.log("Configuración de correo electrónico guardada:", config)
  }

  const handleTestEmail = async (email: string): Promise<{ success: boolean; message: string }> => {
    console.log("Enviando correo de prueba a:", email)
    // Simular envío de correo
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Correo de prueba enviado correctamente a ${email}`,
        })
      }, 1500)
    })
  }

  // Manejadores para configuración de registros
  const handleSaveLoggingConfig = (config: LoggingConfig) => {
    setLoggingConfig(config)
    console.log("Configuración de registros guardada:", config)
  }

  const handleDownloadLog = (fileId: string) => {
    const logFile = logFiles.find((f) => f.id === fileId)
    console.log("Descargando archivo de registro:", logFile?.name)
    // En una aplicación real, aquí se descargaría el archivo
  }

  const handleDeleteLog = (fileId: string) => {
    setLogFiles(logFiles.filter((f) => f.id !== fileId))
    console.log("Archivo de registro eliminado:", fileId)
  }

  const handleClearAllLogs = () => {
    setLogFiles([])
    console.log("Todos los archivos de registro eliminados")
  }

  return (
    <AdminLayout title="Configuración">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Configuración del Sistema</h1>
            <p className="text-muted-foreground">Administra todos los aspectos de configuración del sistema</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Switch id="show-advanced" checked={showAdvanced} onCheckedChange={setShowAdvanced} />
              <Label htmlFor="show-advanced" className="text-sm">
                Modo avanzado
              </Label>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 md:grid-cols-8 h-auto">
            <TabsTrigger value="general" className="flex flex-col py-2 px-3 h-auto">
              <SettingsIcon className="h-4 w-4 mb-1" />
              <span className="text-xs">General</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex flex-col py-2 px-3 h-auto">
              <Shield className="h-4 w-4 mb-1" />
              <span className="text-xs">Seguridad</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex flex-col py-2 px-3 h-auto">
              <Bell className="h-4 w-4 mb-1" />
              <span className="text-xs">Notificaciones</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex flex-col py-2 px-3 h-auto">
              <Palette className="h-4 w-4 mb-1" />
              <span className="text-xs">Apariencia</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex flex-col py-2 px-3 h-auto">
              <Clock className="h-4 w-4 mb-1" />
              <span className="text-xs">Tareas</span>
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex flex-col py-2 px-3 h-auto">
              <Database className="h-4 w-4 mb-1" />
              <span className="text-xs">Respaldos</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex flex-col py-2 px-3 h-auto">
              <Mail className="h-4 w-4 mb-1" />
              <span className="text-xs">Correo</span>
            </TabsTrigger>
            <TabsTrigger value="logging" className="flex flex-col py-2 px-3 h-auto">
              <FileText className="h-4 w-4 mb-1" />
              <span className="text-xs">Registros</span>
            </TabsTrigger>
            {showAdvanced && (
              <TabsTrigger value="advanced" className="flex flex-col py-2 px-3 h-auto">
                <Sliders className="h-4 w-4 mb-1" />
                <span className="text-xs">Avanzado</span>
              </TabsTrigger>
            )}
          </TabsList>

          <div className="mt-6">
            <TabsContent value="general">
              <SettingsForm
                settings={generalSettings}
                showAdvanced={showAdvanced}
                onSave={handleSaveGeneralSettings}
                onReset={handleResetGeneralSettings}
              />
            </TabsContent>

            <TabsContent value="security">
              <SettingsForm
                settings={securitySettings}
                showAdvanced={showAdvanced}
                onSave={handleSaveSecuritySettings}
                onReset={handleResetSecuritySettings}
              />
            </TabsContent>

            <TabsContent value="notifications">
              <SettingsForm
                settings={notificationSettings}
                showAdvanced={showAdvanced}
                onSave={handleSaveNotificationSettings}
                onReset={handleResetNotificationSettings}
              />
            </TabsContent>

            <TabsContent value="appearance">
              <SettingsForm
                settings={appearanceSettings}
                showAdvanced={showAdvanced}
                onSave={handleSaveAppearanceSettings}
                onReset={handleResetAppearanceSettings}
              />
            </TabsContent>

            <TabsContent value="tasks">
              <TaskScheduler
                tasks={tasks}
                onCreateTask={handleCreateTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onToggleTaskStatus={handleToggleTaskStatus}
                onRunTaskNow={handleRunTaskNow}
              />
            </TabsContent>

            <TabsContent value="backup">
              <BackupSettings
                config={backupConfig}
                onSave={handleSaveBackupConfig}
                onRunBackup={handleRunBackup}
                onRestoreBackup={handleRestoreBackup}
              />
            </TabsContent>

            <TabsContent value="email">
              <EmailSettings config={emailConfig} onSave={handleSaveEmailConfig} onTestEmail={handleTestEmail} />
            </TabsContent>

            <TabsContent value="logging">
              <LoggingSettings
                config={loggingConfig}
                logFiles={logFiles}
                onSave={handleSaveLoggingConfig}
                onDownloadLog={handleDownloadLog}
                onDeleteLog={handleDeleteLog}
                onClearAllLogs={handleClearAllLogs}
              />
            </TabsContent>

            <TabsContent value="advanced">
              <SettingsForm
                settings={advancedSettings}
                showAdvanced={showAdvanced}
                onSave={handleSaveAdvancedSettings}
                onReset={handleResetAdvancedSettings}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
