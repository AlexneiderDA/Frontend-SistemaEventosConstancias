"use client"

import type React from "react"
import { X, Download, Clock, User, Activity, Package, Globe, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../../ui/dialog"
import { Button } from "../../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import type { SystemLogEntry } from "../../../types/system-log"


interface LogDetailsProps {
  log: SystemLogEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onExport: (log: SystemLogEntry) => void
}

export const LogDetails: React.FC<LogDetailsProps> = ({ log, open, onOpenChange, onExport }) => {
  if (!log) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    }).format(date)
  }

  const formatDuration = (duration?: number) => {
    if (!duration) return "No disponible"
    if (duration < 1000) return `${duration} milisegundos`
    return `${(duration / 1000).toFixed(2)} segundos`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      case "info":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return "Éxito"
      case "warning":
        return "Advertencia"
      case "error":
        return "Error"
      case "info":
        return "Información"
      default:
        return status
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <span className={`mr-2 ${getStatusColor(log.status)}`}>
              <AlertCircle className="h-5 w-5 inline-block mr-1" />
            </span>
            Detalles del Registro
          </DialogTitle>
          <DialogDescription>ID: {log.id}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Fecha y Hora</div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              {formatDate(log.timestamp)}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Usuario</div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              {log.userName} (ID: {log.userId})
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Acción</div>
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
              {log.action}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Módulo</div>
            <div className="flex items-center">
              <Package className="h-4 w-4 mr-2 text-muted-foreground" />
              {log.module}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Estado</div>
            <div className="flex items-center">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(log.status)}`}
              >
                {getStatusText(log.status)}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Duración</div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              {formatDuration(log.duration)}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Dirección IP</div>
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
              {log.ipAddress}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Descripción</div>
          <div className="rounded-md bg-muted p-3 text-sm">{log.description}</div>
        </div>

        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-4">
            <div className="rounded-md border p-4 max-h-60 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap">
                {Object.entries(log.details).map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <span className="font-semibold">{key}: </span>
                    <span>{typeof value === "object" ? JSON.stringify(value, null, 2) : value}</span>
                  </div>
                ))}
              </pre>
            </div>
          </TabsContent>
          <TabsContent value="json">
            <div className="rounded-md border bg-muted p-4 max-h-60 overflow-y-auto">
              <pre className="text-sm">{JSON.stringify(log, null, 2)}</pre>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={() => onExport(log)} className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Exportar Registro
          </Button>
          <DialogClose asChild>
            <Button variant="outline">
              <X className="mr-2 h-4 w-4" />
              Cerrar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
