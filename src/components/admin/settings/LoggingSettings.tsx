"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Download, Trash2 } from "lucide-react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Switch } from "../../ui/switch"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog"
import type { LoggingConfig } from "../../../types/settings"


interface LogFile {
  id: string
  name: string
  size: string
  date: string
  type: "error" | "access" | "debug" | "system"
}

interface LoggingSettingsProps {
  config: LoggingConfig
  logFiles: LogFile[]
  onSave: (config: LoggingConfig) => void
  onDownloadLog: (fileId: string) => void
  onDeleteLog: (fileId: string) => void
  onClearAllLogs: () => void
}

export const LoggingSettings: React.FC<LoggingSettingsProps> = ({
  config,
  logFiles,
  onSave,
  onDownloadLog,
  onDeleteLog,
  onClearAllLogs,
}) => {
  const [formValues, setFormValues] = useState<LoggingConfig>(config)
  const [isDirty, setIsDirty] = useState(false)
  const [isClearAllDialogOpen, setIsClearAllDialogOpen] = useState(false)
  const [isDeleteLogDialogOpen, setIsDeleteLogDialogOpen] = useState(false)
  const [logToDelete, setLogToDelete] = useState<string | null>(null)

  useEffect(() => {
    setFormValues(config)
    setIsDirty(false)
  }, [config])

  const handleChange = <K extends keyof LoggingConfig>(key: K, value: LoggingConfig[K]) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }))
    setIsDirty(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formValues)
    setIsDirty(false)
  }

  const handleDeleteLog = (fileId: string) => {
    setLogToDelete(fileId)
    setIsDeleteLogDialogOpen(true)
  }

  const confirmDeleteLog = () => {
    if (logToDelete) {
      onDeleteLog(logToDelete)
      setIsDeleteLogDialogOpen(false)
      setLogToDelete(null)
    }
  }

  const handleClearAllLogs = () => {
    setIsClearAllDialogOpen(true)
  }

  const confirmClearAllLogs = () => {
    onClearAllLogs()
    setIsClearAllDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Registros</CardTitle>
          <CardDescription>Configura cómo el sistema registra eventos y errores.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="log-level">Nivel de registro</Label>
                  <Select
                    value={formValues.level}
                    onValueChange={(value) => handleChange("level", value as LoggingConfig["level"])}
                  >
                    <SelectTrigger id="log-level">
                      <SelectValue placeholder="Seleccionar nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="error">Error (solo errores)</SelectItem>
                        <SelectItem value="warning">Advertencia (errores y advertencias)</SelectItem>
                        <SelectItem value="info">Información (errores, advertencias e info)</SelectItem>
                        <SelectItem value="debug">Depuración (todo excepto trazas)</SelectItem>
                        <SelectItem value="trace">Traza (todo)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="log-retention">Retención de registros (días)</Label>
                  <Input
                    id="log-retention"
                    type="number"
                    min="1"
                    value={formValues.retention}
                    onChange={(e) => handleChange("retention", Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-file-logging">Registro en archivos</Label>
                    <Switch
                      id="enable-file-logging"
                      checked={formValues.enableFileLogging}
                      onCheckedChange={(checked) => handleChange("enableFileLogging", checked)}
                    />
                  </div>
                  {formValues.enableFileLogging && (
                    <Input
                      id="log-path"
                      value={formValues.logPath || ""}
                      onChange={(e) => handleChange("logPath", e.target.value)}
                      placeholder="/var/log/app"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-remote-logging">Registro remoto</Label>
                    <Switch
                      id="enable-remote-logging"
                      checked={formValues.enableRemoteLogging}
                      onCheckedChange={(checked) => handleChange("enableRemoteLogging", checked)}
                    />
                  </div>
                  {formValues.enableRemoteLogging && (
                    <Input
                      id="remote-endpoint"
                      value={formValues.remoteEndpoint || ""}
                      onChange={(e) => handleChange("remoteEndpoint", e.target.value)}
                      placeholder="https://logs.example.com/api"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-[#1C8443] hover:bg-[#1C8443]/90" disabled={!isDirty}>
                Guardar configuración
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Archivos de Registro</CardTitle>
            <CardDescription>Gestiona los archivos de registro generados por el sistema.</CardDescription>
          </div>
          <Button
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleClearAllLogs}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Limpiar todos
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Tamaño</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logFiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No hay archivos de registro disponibles.
                    </TableCell>
                  </TableRow>
                ) : (
                  logFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium">{file.name}</TableCell>
                      <TableCell>
                        <LogTypeBadge type={file.type} />
                      </TableCell>
                      <TableCell>{file.size}</TableCell>
                      <TableCell>{file.date}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => onDownloadLog(file.id)} title="Descargar">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteLog(file.id)}
                            title="Eliminar"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Log Dialog */}
      <AlertDialog open={isDeleteLogDialogOpen} onOpenChange={setIsDeleteLogDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el archivo de registro seleccionado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteLog} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear All Logs Dialog */}
      <AlertDialog open={isClearAllDialogOpen} onOpenChange={setIsClearAllDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminarán permanentemente todos los archivos de registro del
              sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClearAllLogs} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
              Eliminar todos
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Badge component for log types
const LogTypeBadge: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "error":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Error
        </span>
      )
    case "access":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Acceso
        </span>
      )
    case "debug":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Debug
        </span>
      )
    case "system":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          Sistema
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {type}
        </span>
      )
  }
}
