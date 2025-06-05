"use client"

import type React from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { Label } from "../../ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { Calendar } from "../../ui/calendar"
import { Badge } from "../../ui/badge"
import type { UserFilters } from "../../../types/user"

interface UserFiltersProps {
  filters: UserFilters
  roles: string[]
  departments: string[]
  onFilterChange: (filters: UserFilters) => void
  onResetFilters: () => void
}

export const UserFiltersComponent: React.FC<UserFiltersProps> = ({
  filters,
  roles,
  departments,
  onFilterChange,
  onResetFilters,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value })
  }

  const handleRoleChange = (value: string) => {
    onFilterChange({ ...filters, role: value })
  }

  const handleDepartmentChange = (value: string) => {
    onFilterChange({ ...filters, department: value })
  }

  const handleStatusChange = (value: string) => {
    onFilterChange({ ...filters, status: value })
  }

  const handleDateFromChange = (date: Date | undefined) => {
    onFilterChange({
      ...filters,
      dateRange: { ...filters.dateRange, from: date ?? null },
    })
  }

  const handleDateToChange = (date: Date | undefined) => {
    onFilterChange({
      ...filters,
      dateRange: { ...filters.dateRange, to: date ?? null },
    })
  }

  // Contar filtros activos
  const activeFiltersCount = [
    filters.role,
    filters.department,
    filters.status,
    filters.dateRange.from,
    filters.dateRange.to,
  ].filter(Boolean).length

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, email..."
              className="pl-10"
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={filters.role} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Roles</SelectLabel>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={filters.department} onValueChange={handleDepartmentChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Departamentos</SelectLabel>
                  <SelectItem value="all">Todos los departamentos</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Estado</SelectLabel>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[140px] justify-between">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Fecha</span>
                  </div>
                  {(filters.dateRange.from || filters.dateRange.to) && (
                    <Badge variant="secondary" className="ml-2 rounded-full px-1 py-0">
                      {filters.dateRange.from && filters.dateRange.to ? 2 : 1}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Desde</Label>
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.from || undefined}
                      onSelect={handleDateFromChange}
                      initialFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hasta</Label>
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.to || undefined}
                      onSelect={handleDateToChange}
                      initialFocus
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onFilterChange({
                          ...filters,
                          dateRange: { from: null, to: null },
                        })
                      }
                    >
                      Limpiar fechas
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="icon" onClick={onResetFilters} title="Limpiar todos los filtros">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
