"use client"

import type React from "react"
import { useState } from "react"
import { Trash2, RefreshCw, Archive, AlertTriangle } from "lucide-react"
import { Button } from "../../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
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
import { Progress } from "../../ui/progress"


interface MaintenanceToolsProps {
  onPurgeOldLogs: (days: number) => Promise<void>
  onClearLogs: (type: string) => Promise<void>
  onOptimizeDatabase: () => Promise<void>
  onExportAllLogs: () => Promise<void>
}

export const MaintenanceTools: React.FC<MaintenanceToolsProps> = ({
  onPurgeOldLogs,
  onClearLogs,
  onOptimizeDatabase,
  onExportAllLogs,
}) => {
  const [purgeDialogOpen, setPurgeDialogOpen] = useState(false)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const [daysToKeep, setDaysToKeep] = useState(30)
  const [logTypeToDelete, setLogTypeToDelete] = useState("all")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [operationMessage, setOperationMessage] = useState("")

  const handlePurgeOldLogs = async () => {
    setIsProcessing(true)
    setProgress(0)
    setOperationMessage("Eliminando registros antiguos...")

    try {
      // Simulación de progreso
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 10
          if (newProgress >= 100) {
            clearInterval(interval)
            return 100
          }
          return newProgress
        })
      }, 300)

      await onPurgeOldLogs(daysToKeep)

      // Asegurar que el progreso llegue al 100%
      setProgress(100)
      setOperationMessage(`Se han eliminado correctamente los registros anteriores a ${daysToKeep} días.`)
    } catch (error) {
      setOperationMessage(`Error al eliminar registros: ${error}`)
    } finally {
      setTimeout(() => {
        setIsProcessing(false)
        setPurgeDialogOpen(false)
        setOperationMessage("")
      }, 1000)
    }
  }

  const handleClearLogs = async () => {
    setIsProcessing(true)
    setProgress(0)
    setOperationMessage(`Eliminando registros de tipo ${logTypeToDelete}...`)

    try {
      // Simulación de progreso
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 10
          if (newProgress >= 100) {
            clearInterval(interval)
            return 100
          }
          return newProgress
        })
      }, 300)

      await onClearLogs(logTypeToDelete)

      // Asegurar que el progreso llegue al 100%
      setProgress(100)
      setOperationMessage(`Se han eliminado correctamente los registros de tipo ${logTypeToDelete}.`)
    } catch (error) {
      setOperationMessage(`Error al eliminar registros: ${error}`)
    } finally {
      setTimeout(() => {
        setIsProcessing(false)
        setClearDialogOpen(false)
        setOperationMessage("")
      }, 1000)
    }
  }

  const handleOptimizeDatabase = async () => {
    setIsProcessing(true)
    setProgress(0)
    setOperationMessage("Optimizando base de datos...")

    try {
      // Simulación de progreso
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 5
          if (newProgress >= 100) {
            clearInterval(interval)
            return 100
          }
          return newProgress
        })
      }, 200)

      await onOptimizeDatabase()

      // Asegurar que el progreso llegue al 100%
      setProgress(100)
      setOperationMessage("Base de datos optimizada correctamente.")
    } catch (error) {
      setOperationMessage(`Error al optimizar la base de datos: ${error}`)
    } finally {
      setTimeout(() => {
        setIsProcessing(false)
        setOperationMessage("")
      }, 1000)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trash2 className="mr-2 h-5 w-5 text-red-500" />
            Limpieza de Registros
          </CardTitle>
          <CardDescription>
            Elimina registros antiguos o por tipo para mantener la base de datos optimizada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setPurgeDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar registros antiguos
            </Button>
          </div>
          <div>
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setClearDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar por tipo de registro
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <RefreshCw className="mr-2 h-5 w-5 text-[#41AD49]" />
            Mantenimiento
          </CardTitle>
          <CardDescription>Herramientas para optimizar y mantener la bitácora del sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Button
              variant="outline"
              className="w-full justify-start text-[#1C8443] hover:text-[#1C8443]/80 hover:bg-[#1C8443]/10"
              onClick={handleOptimizeDatabase}
              disabled={isProcessing}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Optimizar base de datos
            </Button>
          </div>
          <div>
            <Button
              variant="outline"
              className="w-full justify-start text-[#38A2C1] hover:text-[#38A2C1]/80 hover:bg-[#38A2C1]/10"
              onClick={onExportAllLogs}
              disabled={isProcessing}
            >
              <Archive className="mr-2 h-4 w-4" />
              Exportar todos los registros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo para eliminar registros antiguos */}
      <AlertDialog open={purgeDialogOpen} onOpenChange={setPurgeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
              Eliminar registros antiguos
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente todos los registros anteriores al período especificado. Esta
              operación no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {isProcessing ? (
            <div className="space-y-4 py-4">
              <Progress value={progress} className="w-full" />
              <p className="text-center text-sm">{operationMessage}</p>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="days-to-keep">Mantener registros de los últimos</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="days-to-keep"
                    type="number"
                    min="1"
                    value={daysToKeep}
                    onChange={(e) => setDaysToKeep(Number.parseInt(e.target.value) || 30)}
                  />
                  <span>días</span>
                </div>
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePurgeOldLogs}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo para eliminar por tipo de registro */}
      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
              Eliminar por tipo de registro
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente todos los registros del tipo seleccionado. Esta operación no se
              puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {isProcessing ? (
            <div className="space-y-4 py-4">
              <Progress value={progress} className="w-full" />
              <p className="text-center text-sm">{operationMessage}</p>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="log-type">Tipo de registro a eliminar</Label>
                <Select value={logTypeToDelete} onValueChange={setLogTypeToDelete}>
                  <SelectTrigger id="log-type">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los registros</SelectItem>
                    <SelectItem value="success">Registros de éxito</SelectItem>
                    <SelectItem value="warning">Registros de advertencia</SelectItem>
                    <SelectItem value="error">Registros de error</SelectItem>
                    <SelectItem value="info">Registros de información</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearLogs}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
