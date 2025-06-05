"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Upload, RotateCcw, Calendar, Clock, Database, FileArchive, Cloud, Server } from "lucide-react"
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
import { Progress } from "../../ui/progress"
import { Badge } from "../../ui/badge"
import type { BackupConfig } from "../../../types/settings"


interface BackupSettingsProps {
  config: BackupConfig
  onSave: (config: BackupConfig) => void
  onRunBackup: () => void
  onRestoreBackup: (file: File) => void
}

export const BackupSettings: React.FC<BackupSettingsProps> = ({ config, onSave, onRunBackup, onRestoreBackup }) => {
  const [formValues, setFormValues] = useState<BackupConfig>(config)
  const [isDirty, setIsDirty] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [restoreProgress, setRestoreProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  useEffect(() => {
    setFormValues(config)
    setIsDirty(false)
  }, [config])

  const handleChange = <K extends keyof BackupConfig>(key: K, value: BackupConfig[K]) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleRestore = () => {
    if (selectedFile) {
      setIsRestoring(true)
      setRestoreProgress(0)

      // Simulate progress
      const interval = setInterval(() => {
        setRestoreProgress((prev) => {
          const newProgress = prev + 10
          if (newProgress >= 100) {
            clearInterval(interval)
            setTimeout(() => {
              onRestoreBackup(selectedFile)
              setIsRestoring(false)
              setSelectedFile(null)
              if (fileInputRef.current) {
                fileInputRef.current.value = ""
              }
            }, 500)
            return 100
          }
          return newProgress
        })
      }, 300)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Nunca"
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Copias de Seguridad</CardTitle>
          <CardDescription>
            Configura cómo y cuándo se realizarán las copias de seguridad automáticas del sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="backup-enabled"
                  checked={formValues.enabled}
                  onCheckedChange={(checked) => handleChange("enabled", checked)}
                />
                <Label htmlFor="backup-enabled" className="font-medium">
                  Habilitar copias de seguridad automáticas
                </Label>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={onRunBackup}
                className="flex items-center"
                disabled={isRestoring}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Ejecutar ahora
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Frecuencia</Label>
                  <Select
                    value={formValues.frequency}
                    onValueChange={(value) => handleChange("frequency", value as BackupConfig["frequency"])}
                    disabled={!formValues.enabled}
                  >
                    <SelectTrigger id="backup-frequency">
                      <SelectValue placeholder="Seleccionar frecuencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="daily">Diaria</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensual</SelectItem>
                        <SelectItem value="custom">Personalizada</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {formValues.frequency === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="backup-cron">Programación personalizada (cron)</Label>
                    <Input
                      id="backup-cron"
                      value={formValues.customCron || ""}
                      onChange={(e) => handleChange("customCron", e.target.value)}
                      placeholder="0 0 * * *"
                      disabled={!formValues.enabled}
                    />
                    <p className="text-xs text-muted-foreground">Formato cron: minuto hora día-mes mes día-semana</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="backup-retention">Retención (días)</Label>
                  <Input
                    id="backup-retention"
                    type="number"
                    min="1"
                    value={formValues.retention}
                    onChange={(e) => handleChange("retention", Number(e.target.value))}
                    disabled={!formValues.enabled}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="backup-location">Ubicación</Label>
                  <Select
                    value={formValues.location}
                    onValueChange={(value) => handleChange("location", value as BackupConfig["location"])}
                    disabled={!formValues.enabled}
                  >
                    <SelectTrigger id="backup-location">
                      <SelectValue placeholder="Seleccionar ubicación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="local">Local</SelectItem>
                        <SelectItem value="cloud">Nube</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {formValues.location === "cloud" && (
                  <div className="space-y-2">
                    <Label htmlFor="backup-cloud-provider">Proveedor de nube</Label>
                    <Select
                      value={formValues.cloudProvider || ""}
                      onValueChange={(value) => handleChange("cloudProvider", value as BackupConfig["cloudProvider"])}
                      disabled={!formValues.enabled}
                    >
                      <SelectTrigger id="backup-cloud-provider">
                        <SelectValue placeholder="Seleccionar proveedor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="s3">Amazon S3</SelectItem>
                          <SelectItem value="dropbox">Dropbox</SelectItem>
                          <SelectItem value="google">Google Drive</SelectItem>
                          <SelectItem value="azure">Microsoft Azure</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="backup-include-database"
                      checked={formValues.includeDatabase}
                      onCheckedChange={(checked) => handleChange("includeDatabase", checked)}
                      disabled={!formValues.enabled}
                    />
                    <Label htmlFor="backup-include-database">Incluir base de datos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="backup-include-uploads"
                      checked={formValues.includeUploads}
                      onCheckedChange={(checked) => handleChange("includeUploads", checked)}
                      disabled={!formValues.enabled}
                    />
                    <Label htmlFor="backup-include-uploads">Incluir archivos subidos</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-md">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Estado de las copias de seguridad</div>
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground mr-1">Última copia:</span>
                      <span>{formatDate(config.lastBackup)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground mr-1">Próxima copia:</span>
                      <span>{formatDate(config.nextBackup)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {formValues.location === "local" ? (
                    <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                      <Server className="mr-1 h-3 w-3" />
                      Local
                    </Badge>
                  ) : (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      <Cloud className="mr-1 h-3 w-3" />
                      Nube
                    </Badge>
                  )}
                  {formValues.includeDatabase && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <Database className="mr-1 h-3 w-3" />
                      Base de datos
                    </Badge>
                  )}
                  {formValues.includeUploads && (
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                      <FileArchive className="mr-1 h-3 w-3" />
                      Archivos
                    </Badge>
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
        <CardHeader>
          <CardTitle>Restaurar Copia de Seguridad</CardTitle>
          <CardDescription>Restaura el sistema a partir de una copia de seguridad previa.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".zip,.sql,.gz,.tar"
                  onChange={handleFileChange}
                  disabled={isRestoring}
                />
              </div>
              <Button
                type="button"
                onClick={handleRestore}
                disabled={!selectedFile || isRestoring}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Upload className="mr-2 h-4 w-4" />
                Restaurar
              </Button>
            </div>

            {isRestoring && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Restaurando...</span>
                  <span>{restoreProgress}%</span>
                </div>
                <Progress value={restoreProgress} className="h-2" />
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-amber-600">Advertencia:</p>
              <p>
                Restaurar una copia de seguridad sobrescribirá todos los datos actuales. Este proceso no se puede
                deshacer. Asegúrate de tener una copia de seguridad reciente antes de continuar.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
