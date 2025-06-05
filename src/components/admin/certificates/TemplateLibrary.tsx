"use client"

import type React from "react"
import { useState } from "react"
import { Search, Filter, SortAsc, SortDesc, Plus, MoreHorizontal } from "lucide-react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import { Switch } from "../../ui/switch"
import { Label } from "../../ui/label"
import type { CertificateTemplate, TemplateFilter } from "../../../types/certificate"

interface TemplateLibraryProps {
  templates: CertificateTemplate[]
  filters: TemplateFilter
  onFilterChange: (filters: TemplateFilter) => void
  onCreateTemplate: () => void
  onEditTemplate: (template: CertificateTemplate) => void
  onDuplicateTemplate: (template: CertificateTemplate) => void
  onDeleteTemplate: (template: CertificateTemplate) => void
  onSetDefaultTemplate: (template: CertificateTemplate) => void
  eventTypes: { value: string; label: string }[]
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  templates,
  filters,
  onFilterChange,
  onCreateTemplate,
  onEditTemplate,
  onDuplicateTemplate,
  onDeleteTemplate,
  onSetDefaultTemplate,
  eventTypes,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value })
  }

  const handleSortChange = (value: "name" | "createdAt" | "updatedAt") => {
    onFilterChange({ ...filters, sortBy: value })
  }

  const handleSortDirectionToggle = () => {
    onFilterChange({
      ...filters,
      sortDirection: filters.sortDirection === "asc" ? "desc" : "asc",
    })
  }

  const handleEventTypeChange = (value: string) => {
    onFilterChange({ ...filters, eventType: value })
  }

  const handleDefaultToggle = (checked: boolean) => {
    onFilterChange({ ...filters, showOnlyDefault: checked })
  }

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar plantillas..."
            className="pl-8"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={toggleFilters} className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <div className="flex items-center gap-1">
            <Select value={filters.sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nombre</SelectItem>
                <SelectItem value="createdAt">Fecha creación</SelectItem>
                <SelectItem value="updatedAt">Última edición</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={handleSortDirectionToggle}>
              {filters.sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>
          <Button onClick={onCreateTemplate} className="bg-[#1C8443] hover:bg-[#1C8443]/90">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Plantilla
          </Button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="p-4 border rounded-md bg-background shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event-type">Tipo de Evento</Label>
              <Select value={filters.eventType} onValueChange={handleEventTypeChange}>
                <SelectTrigger id="event-type">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="show-default" checked={filters.showOnlyDefault} onCheckedChange={handleDefaultToggle} />
              <Label htmlFor="show-default">Mostrar solo plantillas predeterminadas</Label>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-[1.414/1] bg-gray-100 overflow-hidden">
              {template.thumbnail ? (
                <img
                  src={template.thumbnail || "/placeholder.svg"}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Vista previa no disponible
                </div>
              )}
              {template.isDefault && (
                <div className="absolute top-2 left-2 bg-[#1C8443] text-white text-xs px-2 py-1 rounded-md">
                  Predeterminada
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg truncate">{template.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{template.description || "Sin descripción"}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditTemplate(template)}>Editar</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicateTemplate(template)}>Duplicar</DropdownMenuItem>
                    {!template.isDefault && (
                      <DropdownMenuItem onClick={() => onSetDefaultTemplate(template)}>
                        Establecer como predeterminada
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="text-red-600" onClick={() => onDeleteTemplate(template)}>
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {template.eventTypes.map((typeId) => {
                  const typeLabel = eventTypes.find((t) => t.value === typeId)?.label || typeId
                  return (
                    <span
                      key={typeId}
                      className="inline-block bg-[#8DC642]/20 text-[#1C8443] text-xs px-2 py-1 rounded-full"
                    >
                      {typeLabel}
                    </span>
                  )
                })}
              </div>
              <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground">
                <span>Creada: {new Date(template.createdAt).toLocaleDateString()}</span>
                <span>Actualizada: {new Date(template.updatedAt).toLocaleDateString()}</span>
              </div>
              <Button
                className="w-full mt-4 bg-[#38A2C1] hover:bg-[#38A2C1]/90"
                onClick={() => onEditTemplate(template)}
              >
                Editar Plantilla
              </Button>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No se encontraron plantillas</p>
          <Button className="mt-4 bg-[#1C8443] hover:bg-[#1C8443]/90" onClick={onCreateTemplate}>
            Crear primera plantilla
          </Button>
        </div>
      )}
    </div>
  )
}
