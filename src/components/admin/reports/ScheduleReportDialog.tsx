"use client"

import type React from "react"
import { useState } from "react"
import { Clock, Send, Plus, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Report, ScheduledReport } from "@/types/report"

interface ScheduleReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  report: Report
  parameters: Record<string, any>
  onSchedule: (schedule: Omit<ScheduledReport, "id" | "createdAt" | "createdBy" | "lastRun" | "nextRun">) => void
}

export const ScheduleReportDialog: React.FC<ScheduleReportDialogProps> = ({
  open,
  onOpenChange,
  report,
  parameters,
  onSchedule,
}) => {
  const [name, setName] = useState(`${report.name} - Programado`)
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "custom">("weekly")
  const [dayOfWeek, setDayOfWeek] = useState<number>(1) // Lunes
  const [dayOfMonth, setDayOfMonth] = useState<number>(1)
  const [time, setTime] = useState<string>("08:00")
  const [customCron, setCustomCron] = useState<string>("0 8 * * 1")
  const [format, setFormat] = useState<"pdf" | "excel" | "csv" | "json">("pdf")
  const [emails, setEmails] = useState<string[]>([])
  const [newEmail, setNewEmail] = useState<string>("")
  const [users, setUsers] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<"emails" | "users">("emails")

  const handleAddEmail = () => {
    if (newEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail) && !emails.includes(newEmail)) {
      setEmails([...emails, newEmail])
      setNewEmail("")
    }
  }

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email))
  }

  const handleSchedule = () => {
    const schedule: Omit<ScheduledReport, "id" | "createdAt" | "createdBy" | "lastRun" | "nextRun"> = {
      reportId: report.id,
      name,
      parameters,
      schedule: {
        frequency,
        time,
        ...(frequency === "weekly" && { dayOfWeek }),
        ...(frequency === "monthly" && { dayOfMonth }),
        ...(frequency === "custom" && { customCron }),
      },
      format,
      recipients: {
        emails,
        users,
      },
      active: true,
    }

    onSchedule(schedule)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Programar Envío de Reporte</DialogTitle>
          <DialogDescription>Configura cuándo y a quién enviar este reporte automáticamente.</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="schedule-name">Nombre de la programación</Label>
            <Input
              id="schedule-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre descriptivo para esta programación"
            />
          </div>

          <div className="space-y-2">
            <Label>Frecuencia</Label>
            <RadioGroup
              value={frequency}
              onValueChange={(value) => setFrequency(value as "daily" | "weekly" | "monthly" | "custom")}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily" className="cursor-pointer">
                  Diario
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly" className="cursor-pointer">
                  Semanal
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly" className="cursor-pointer">
                  Mensual
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="cursor-pointer">
                  Personalizado (cron)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {frequency === "weekly" && (
            <div className="space-y-2">
              <Label htmlFor="day-of-week">Día de la semana</Label>
              <Select value={dayOfWeek.toString()} onValueChange={(value) => setDayOfWeek(Number.parseInt(value))}>
                <SelectTrigger id="day-of-week">
                  <SelectValue placeholder="Seleccionar día" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Lunes</SelectItem>
                  <SelectItem value="2">Martes</SelectItem>
                  <SelectItem value="3">Miércoles</SelectItem>
                  <SelectItem value="4">Jueves</SelectItem>
                  <SelectItem value="5">Viernes</SelectItem>
                  <SelectItem value="6">Sábado</SelectItem>
                  <SelectItem value="0">Domingo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {frequency === "monthly" && (
            <div className="space-y-2">
              <Label htmlFor="day-of-month">Día del mes</Label>
              <Select value={dayOfMonth.toString()} onValueChange={(value) => setDayOfMonth(Number.parseInt(value))}>
                <SelectTrigger id="day-of-month">
                  <SelectValue placeholder="Seleccionar día" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {frequency === "custom" ? (
            <div className="space-y-2">
              <Label htmlFor="custom-cron">Expresión cron</Label>
              <Input
                id="custom-cron"
                value={customCron}
                onChange={(e) => setCustomCron(e.target.value)}
                placeholder="0 8 * * 1"
              />
              <p className="text-xs text-muted-foreground">Formato: minuto hora día-del-mes mes día-de-la-semana</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="time">Hora</Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="format">Formato</Label>
            <Select value={format} onValueChange={(value) => setFormat(value as "pdf" | "excel" | "csv" | "json")}>
              <SelectTrigger id="format">
                <SelectValue placeholder="Seleccionar formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Destinatarios</Label>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "emails" | "users")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="emails">Correos</TabsTrigger>
                <TabsTrigger value="users">Usuarios</TabsTrigger>
              </TabsList>

              <TabsContent value="emails" className="space-y-4 mt-2">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Correo electrónico"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddEmail()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={handleAddEmail} className="shrink-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {emails.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No hay destinatarios agregados.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {emails.map((email) => (
                        <div
                          key={email}
                          className="flex items-center bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                        >
                          {email}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1 text-muted-foreground hover:text-foreground"
                            onClick={() => handleRemoveEmail(email)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="users" className="space-y-4 mt-2">
                <Select
                  value=""
                  onValueChange={(value) => {
                    if (value && !users.includes(value)) {
                      setUsers([...users, value])
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar usuarios" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">Juan Pérez</SelectItem>
                    <SelectItem value="user2">María García</SelectItem>
                    <SelectItem value="user3">Carlos López</SelectItem>
                    <SelectItem value="user4">Ana Martínez</SelectItem>
                  </SelectContent>
                </Select>

                <div className="space-y-2">
                  {users.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No hay usuarios agregados.</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">No hay usuarios seleccionados.</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSchedule}>
            <Send className="mr-2 h-4 w-4" />
            Programar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
