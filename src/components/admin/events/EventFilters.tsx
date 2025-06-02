"use client"

import type React from "react"
import { Search, Filter, X, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import type { EventFilters, EventTag, Organizer } from "@/types/event"

interface EventFiltersProps {
  filters: EventFilters
  eventTypes: { value: string; label: string }[]
  eventStatuses: { value: string; label: string }[]
  organizers: Organizer[]
  tags: EventTag[]
  onFilterChange: (filters: EventFilters) => void
  onResetFilters: () => void
}

export const EventFiltersComponent: React.FC<EventFiltersProps> = ({
  filters,
  eventTypes,
  eventStatuses,
  organizers,
  tags,
  onFilterChange,
  onResetFilters,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value })
  }

  const handleTypeChange = (value: string) => {
    onFilterChange({ ...filters, type: value as any })
  }

  const handleStatusChange = (value: string) => {
    onFilterChange({ ...filters, status: value as any })
  }

  const handleOrganizerChange = (value: string) => {
    onFilterChange({ ...filters, organizer: value })
  }

  const handleDateFromChange = (date: Date | null) => {
    onFilterChange({
      ...filters,
      dateRange: { ...filters.dateRange, from: date },
    })
  }

  const handleDateToChange = (date: Date | null) => {
    onFilterChange({
      ...filters,
      dateRange: { ...filters.dateRange, to: date },
    })
  }

  const handlePublishedChange = (checked: boolean) => {
    onFilterChange({
      ...filters,
      isPublished: checked === true ? true : checked === false ? false : null,
    })
  }

  const handleTagSelect = (tagId: string) => {
    const newTags = filters.tags.includes(tagId) ? filters.tags.filter((id) => id !== tagId) : [...filters.tags, tagId]

    onFilterChange({
      ...filters,
      tags: newTags,
    })
  }

  // Contar filtros activos
  const activeFiltersCount = [
    filters.type !== "all",
    filters.status !== "all",
    filters.organizer !== "",
    filters.dateRange.from,
    filters.dateRange.to,
    filters.isPublished !== null,
    filters.tags.length > 0,
  ].filter(Boolean).length

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por título, descripción, ubicación..."
              className="pl-10"
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={filters.type} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tipo de evento</SelectLabel>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
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
                  {eventStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={filters.organizer} onValueChange={handleOrganizerChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Organizador" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Organizador</SelectLabel>
                  <SelectItem value="all">Todos los organizadores</SelectItem>
                  {organizers.map((organizer) => (
                    <SelectItem key={organizer.id} value={organizer.id}>
                      {organizer.name}
                    </SelectItem>
                  ))}
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

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[140px] justify-between">
                  <div className="flex items-center">
                    <Tag className="mr-2 h-4 w-4" />
                    <span>Etiquetas</span>
                  </div>
                  {filters.tags.length > 0 && (
                    <Badge variant="secondary" className="ml-2 rounded-full px-1 py-0">
                      {filters.tags.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Buscar etiqueta..." />
                  <CommandList>
                    <CommandEmpty>No se encontraron etiquetas.</CommandEmpty>
                    <CommandGroup>
                      {tags.map((tag) => (
                        <CommandItem
                          key={tag.id}
                          onSelect={() => handleTagSelect(tag.id)}
                          className="flex items-center"
                        >
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: tag.color }} />
                          <span>{tag.name}</span>
                          {filters.tags.includes(tag.id) && <Check className="ml-auto h-4 w-4" />}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
                <Separator />
                <div className="p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => onFilterChange({ ...filters, tags: [] })}
                  >
                    Limpiar etiquetas
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[140px]">
                  <div className="flex items-center">
                    <span>Publicación</span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-4" align="start">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="published">Publicados</Label>
                    <Switch
                      id="published"
                      checked={filters.isPublished === true}
                      onCheckedChange={() => handlePublishedChange(true)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="unpublished">No publicados</Label>
                    <Switch
                      id="unpublished"
                      checked={filters.isPublished === false}
                      onCheckedChange={() => handlePublishedChange(false)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="all-published">Todos</Label>
                    <Switch
                      id="all-published"
                      checked={filters.isPublished === null}
                      onCheckedChange={() => handlePublishedChange(null)}
                    />
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

// Componente Check para las etiquetas seleccionadas
const Check = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
