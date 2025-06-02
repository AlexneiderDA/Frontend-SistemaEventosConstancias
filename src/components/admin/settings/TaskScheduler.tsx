"use client"

import React from "react"
import { useState } from "react"
import {
  Calendar,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { ScheduledTask } from "@/types/settings"

interface TaskSchedulerProps {
  tasks: ScheduledTask[]
  onCreateTask: (task: Omit<ScheduledTask, "id" | "createdAt" | "updatedAt" | "lastRun" | "nextRun">) => void
  onUpdateTask: (task: ScheduledTask) => void
  onDeleteTask: (taskId: string) => void
  onToggleTaskStatus: (taskId: string, active: boolean) => void
  onRunTaskNow: (taskId: string) => void
}

export const TaskScheduler: React.FC<TaskSchedulerProps> = ({
  tasks,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onToggleTaskStatus,
  onRunTaskNow,
}) => {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Partial<ScheduledTask> | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
  const [expandedLogs, setExpandedLogs] = useState<string[]>([])

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleCreateTask = () => {
    setCurrentTask({
      name: "",
      description: "",
      command: "",
      schedule: "0 0 * * *", // Daily at midnight
      status: "active",
    })
    setIsTaskFormOpen(true)
  }

  const handleEditTask = (task: ScheduledTask) => {
    setCurrentTask(task)
    setIsTaskFormOpen(true)
  }

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      onDeleteTask(taskToDelete)
      setIsDeleteDialogOpen(false)
      setTaskToDelete(null)
    }
  }

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentTask?.name || !currentTask?.command || !currentTask?.schedule) {
      return // Basic validation
    }

    if (currentTask.id) {
      // Update existing task
      onUpdateTask(currentTask as ScheduledTask)
    } else {
      // Create new task
      onCreateTask({
        name: currentTask.name,
        description: currentTask.description || "",
        command: currentTask.command,
        schedule: currentTask.schedule,
        status: currentTask.status as "active" | "paused" | "error",
      })
    }

    setIsTaskFormOpen(false)
    setCurrentTask(null)
  }

  const toggleTaskLogs = (taskId: string) => {
    setExpandedLogs((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Activo</Badge>
      case "paused":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Pausado</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Error</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getLogStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "info":
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Programador de Tareas</h2>
          <p className="text-muted-foreground">Administra las tareas programadas del sistema</p>
        </div>
        <Button onClick={handleCreateTask} className="bg-[#1C8443] hover:bg-[#1C8443]/90">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Tarea
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Programación</TableHead>
                <TableHead>Última Ejecución</TableHead>
                <TableHead>Próxima Ejecución</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No hay tareas programadas.
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => (
                  <React.Fragment key={task.id}>
                    <TableRow>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.name}</div>
                          {task.description && <div className="text-sm text-muted-foreground">{task.description}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="font-mono text-xs bg-gray-100 p-1 rounded">{task.schedule}</div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Formato cron: minuto hora día-mes mes día-semana</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(task.lastRun)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(task.nextRun)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(task.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRunTaskNow(task.id)}
                            title="Ejecutar ahora"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onToggleTaskStatus(task.id, task.status !== "active")}
                            title={task.status === "active" ? "Pausar" : "Activar"}
                          >
                            {task.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditTask(task)} title="Editar">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTask(task.id)}
                            title="Eliminar"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {task.logs && task.logs.length > 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="p-0 border-t-0">
                          <Accordion
                            type="single"
                            collapsible
                            value={expandedLogs.includes(task.id) ? task.id : ""}
                            onValueChange={(value) => {
                              if (value === task.id) {
                                setExpandedLogs((prev) => [...prev, task.id])
                              } else {
                                setExpandedLogs((prev) => prev.filter((id) => id !== task.id))
                              }
                            }}
                          >
                            <AccordionItem value={task.id} className="border-0">
                              <AccordionTrigger className="py-2 px-4 text-sm">Registros de ejecución</AccordionTrigger>
                              <AccordionContent>
                                <div className="px-4 pb-4">
                                  <div className="max-h-60 overflow-y-auto border rounded-md">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead className="w-40">Fecha</TableHead>
                                          <TableHead className="w-24">Estado</TableHead>
                                          <TableHead>Mensaje</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {task.logs.map((log) => (
                                          <TableRow key={log.id}>
                                            <TableCell className="text-xs">
                                              {new Date(log.timestamp).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                              <div className="flex items-center">
                                                {getLogStatusIcon(log.status)}
                                                <span className="ml-1 text-xs capitalize">{log.status}</span>
                                              </div>
                                            </TableCell>
                                            <TableCell className="text-xs font-mono">{log.message}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Task Form Dialog */}
      <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentTask?.id ? "Editar Tarea" : "Nueva Tarea Programada"}</DialogTitle>
            <DialogDescription>
              {currentTask?.id
                ? "Modifica los detalles de la tarea programada."
                : "Configura una nueva tarea para ejecutar automáticamente."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitTask}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-name" className="text-right">
                  Nombre
                </Label>
                <div className="col-span-3">
                  <Input
                    id="task-name"
                    value={currentTask?.name || ""}
                    onChange={(e) => setCurrentTask({ ...currentTask, name: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="task-description" className="text-right pt-2">
                  Descripción
                </Label>
                <div className="col-span-3">
                  <Textarea
                    id="task-description"
                    value={currentTask?.description || ""}
                    onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-command" className="text-right">
                  Comando
                </Label>
                <div className="col-span-3">
                  <Input
                    id="task-command"
                    value={currentTask?.command || ""}
                    onChange={(e) => setCurrentTask({ ...currentTask, command: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-schedule" className="text-right">
                  Programación
                </Label>
                <div className="col-span-3">
                  <div className="flex flex-col space-y-2">
                    <Input
                      id="task-schedule"
                      value={currentTask?.schedule || ""}
                      onChange={(e) => setCurrentTask({ ...currentTask, schedule: e.target.value })}
                      placeholder="0 0 * * *"
                      required
                    />
                    <div className="text-xs text-muted-foreground">
                      Formato cron: minuto hora día-mes mes día-semana (ej: 0 0 * * * = diariamente a medianoche)
                    </div>
                    <Select
                      value={currentTask?.schedule || ""}
                      onValueChange={(value) => setCurrentTask({ ...currentTask, schedule: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar programación común" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="* * * * *">Cada minuto</SelectItem>
                          <SelectItem value="0 * * * *">Cada hora</SelectItem>
                          <SelectItem value="0 0 * * *">Diariamente (medianoche)</SelectItem>
                          <SelectItem value="0 12 * * *">Diariamente (mediodía)</SelectItem>
                          <SelectItem value="0 0 * * 0">Semanalmente (domingo)</SelectItem>
                          <SelectItem value="0 0 1 * *">Mensualmente (día 1)</SelectItem>
                          <SelectItem value="0 0 1 1 *">Anualmente (1 de enero)</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">Estado</div>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="task-status"
                    checked={currentTask?.status === "active"}
                    onCheckedChange={(checked) =>
                      setCurrentTask({ ...currentTask, status: checked ? "active" : "paused" })
                    }
                  />
                  <Label htmlFor="task-status">{currentTask?.status === "active" ? "Activo" : "Pausado"}</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsTaskFormOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#1C8443] hover:bg-[#1C8443]/90">
                {currentTask?.id ? "Guardar cambios" : "Crear tarea"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la tarea programada y todos sus registros
              asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTask} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
