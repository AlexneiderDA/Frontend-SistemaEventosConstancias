"use client"

import type React from "react"
import { useState } from "react"
import { Search, Filter, Calendar, User, Activity, Package, RefreshCw } from "lucide-react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { Calendar as CalendarComponent } from "../../ui/calendar"
import { Badge } from "../../ui/badge"
import type { SystemLogFilter } from "../../../types/system-log"


interface LogFiltersProps {
  filters: SystemLogFilter
  onFilterChange: (filters: SystemLogFilter) => void
  onReset: () => void
  users: { id: string; name: string }[]
  actions: string[]
  modules: string[]
}

export const LogFilters: React.FC<LogFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  users,
  actions,
  modules,
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || "")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [startDate, setStartDate] = useState<Date | undefined>(
    filters.startDate ? new Date(filters.startDate) : undefined,
  )
  const [endDate, setEndDate] = useState<Date | undefined>(filters.endDate ? new Date(filters.endDate) : undefined)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilterChange({ ...filters, searchTerm })
  }

  const handleFilterChange = (key: keyof SystemLogFilter, value: string | undefined) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const handleDateChange = (range: { from?: Date; to?: Date }) => {
    setStartDate(range.from)
    setEndDate(range.to)

    if (range.from) {
      onFilterChange({
        ...filters,
        startDate: range.from.toISOString(),
        endDate: range.to ? range.to.toISOString() : undefined,
      })
    }
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.startDate) count++
    if (filters.userId) count++
    if (filters.action) count++
    if (filters.module) count++
    if (filters.status) count++
    if (filters.searchTerm) count++
    return count
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearchSubmit} className="flex w-full items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar en la bitácora..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <Button type="submit" variant="default" className="bg-[#1C8443] hover:bg-[#1C8443]/90">
          Buscar
        </Button>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Fecha</span>
              {(filters.startDate || filters.endDate) && (
                <Badge variant="secondary" className="ml-1 rounded-sm px-1 font-normal">
                  {filters.startDate ? new Date(filters.startDate).toLocaleDateString() : "Inicio"} -{" "}
                  {filters.endDate ? new Date(filters.endDate).toLocaleDateString() : "Fin"}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="range"
              selected={{
                from: startDate,
                to: endDate,
              }}
              onSelect={(range) => handleDateChange(range || {})}
              numberOfMonths={2}
              defaultMonth={new Date()}
            />
            <div className="flex items-center justify-between border-t p-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setStartDate(undefined)
                  setEndDate(undefined)
                  handleFilterChange("startDate", undefined)
                  handleFilterChange("endDate", undefined)
                }}
              >
                Limpiar
              </Button>
              <Button onClick={() => setShowDatePicker(false)}>Aplicar</Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-2">
          <Label htmlFor="user-filter" className="sr-only">
            Usuario
          </Label>
          <Select
            value={filters.userId || ""}
            onValueChange={(value) => handleFilterChange("userId", value || undefined)}
          >
            <SelectTrigger id="user-filter" className="w-[180px]">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <SelectValue placeholder="Usuario" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los usuarios</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="action-filter" className="sr-only">
            Acción
          </Label>
          <Select
            value={filters.action || ""}
            onValueChange={(value) => handleFilterChange("action", value || undefined)}
          >
            <SelectTrigger id="action-filter" className="w-[180px]">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <SelectValue placeholder="Acción" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las acciones</SelectItem>
              {actions.map((action) => (
                <SelectItem key={action} value={action}>
                  {action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="module-filter" className="sr-only">
            Módulo
          </Label>
          <Select
            value={filters.module || ""}
            onValueChange={(value) => handleFilterChange("module", value || undefined)}
          >
            <SelectTrigger id="module-filter" className="w-[180px]">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <SelectValue placeholder="Módulo" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los módulos</SelectItem>
              {modules.map((module) => (
                <SelectItem key={module} value={module}>
                  {module}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="status-filter" className="sr-only">
            Estado
          </Label>
          <Select
            value={filters.status || ""}
            onValueChange={(value) =>
              handleFilterChange("status", value as "success" | "warning" | "error" | "info" | undefined)
            }
          >
            <SelectTrigger id="status-filter" className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Estado" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="success">Éxito</SelectItem>
              <SelectItem value="warning">Advertencia</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="info">Información</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {getActiveFiltersCount() > 0 && (
          <Button variant="ghost" onClick={onReset} className="ml-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Limpiar filtros ({getActiveFiltersCount()})
          </Button>
        )}
      </div>
    </div>
  )
}
