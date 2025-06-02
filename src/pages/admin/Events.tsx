"use client"

import type React from "react"
import { useState } from "react"
import { Plus, AlertTriangle, FileText, Download, Trash2, Edit } from "lucide-react"
import { Button } from "../../components/ui/button"
import { AdminLayout } from "../../components/admin/layouts/AdminLayout"
import { EventsTable } from "../../components/admin/events/EventsTable"
import { EventFiltersComponent } from "../../components/admin/events/EventFilters"
import { EventForm } from "../../components/admin/events/EventForm"
import { TransferOwnershipDialog } from "../../components/admin/events/TransferOwnershipDialog"
import { BulkEditDialog, type BulkEditChanges } from "../../components/admin/events/BulkEditDialog"
import { EventStatsComponent } from "../../components/admin/events/EventStats"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import type { Event, EventFilters, EventTag, Organizer, EventStats } from "../../types/event"

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Conferencia de Inteligencia Artificial",
    description: "Conferencia sobre los últimos avances en IA y aprendizaje automático",
    startDate: "2023-06-15T09:00:00",
    endDate: "2023-06-15T18:00:00",
    location: "Auditorio Principal, Campus Central",
    type: "conference",
    status: "completed",
    capacity: 200,
    registeredAttendees: 187,
    organizerId: "1",
    organizerName: "Carlos Mendoza",
    createdAt: "2023-03-10T14:30:00",
    updatedAt: "2023-06-16T10:15:00",
    isPublished: true,
    tags: ["1", "3", "5"],
  },
  {
    id: "2",
    title: "Taller de Desarrollo Web",
    description: "Taller práctico sobre desarrollo web con React y Next.js",
    startDate: "2023-07-20T10:00:00",
    endDate: "2023-07-21T16:00:00",
    location: "Laboratorio de Computación, Edificio B",
    type: "workshop",
    status: "completed",
    capacity: 30,
    registeredAttendees: 28,
    organizerId: "2",
    organizerName: "María López",
    createdAt: "2023-05-05T09:45:00",
    updatedAt: "2023-07-22T11:30:00",
    isPublished: true,
    tags: ["2", "4"],
  },
  {
    id: "3",
    title: "Seminario de Investigación Científica",
    description: "Seminario sobre metodologías de investigación y publicación de artículos científicos",
    startDate: "2023-08-10T14:00:00",
    endDate: "2023-08-10T18:00:00",
    location: "Sala de Conferencias, Biblioteca Central",
    type: "seminar",
    status: "completed",
    capacity: 50,
    registeredAttendees: 42,
    organizerId: "3",
    organizerName: "Juan Pérez",
    createdAt: "2023-06-15T16:20:00",
    updatedAt: "2023-08-11T09:10:00",
    isPublished: true,
    tags: ["3", "6"],
  },
  {
    id: "4",
    title: "Curso de Programación en Python",
    description: "Curso intensivo de programación en Python para principiantes",
    startDate: "2023-09-05T09:00:00",
    endDate: "2023-09-09T13:00:00",
    location: "Aula 105, Edificio de Ingeniería",
    type: "course",
    status: "completed",
    capacity: 25,
    registeredAttendees: 25,
    organizerId: "4",
    organizerName: "Ana García",
    createdAt: "2023-07-20T11:30:00",
    updatedAt: "2023-09-10T14:45:00",
    isPublished: true,
    tags: ["2", "4", "7"],
  },
  {
    id: "5",
    title: "Reunión de Coordinación Académica",
    description: "Reunión para coordinar actividades académicas del próximo semestre",
    startDate: "2023-10-15T10:00:00",
    endDate: "2023-10-15T12:00:00",
    location: "Sala de Juntas, Rectoría",
    type: "meeting",
    status: "completed",
    capacity: 15,
    registeredAttendees: 12,
    organizerId: "5",
    organizerName: "Roberto Sánchez",
    createdAt: "2023-09-30T08:15:00",
    updatedAt: "2023-10-16T09:30:00",
    isPublished: true,
    tags: ["8"],
  },
  {
    id: "6",
    title: "Conferencia de Sostenibilidad Ambiental",
    description: "Conferencia sobre prácticas sostenibles y conservación del medio ambiente",
    startDate: "2023-11-20T15:00:00",
    endDate: "2023-11-20T19:00:00",
    location: "Auditorio Verde, Campus Sur",
    type: "conference",
    status: "completed",
    capacity: 150,
    registeredAttendees: 132,
    organizerId: "1",
    organizerName: "Carlos Mendoza",
    createdAt: "2023-09-15T13:40:00",
    updatedAt: "2023-11-21T10:20:00",
    isPublished: true,
    tags: ["1", "9"],
  },
  {
    id: "7",
    title: "Taller de Diseño UX/UI",
    description: "Taller práctico sobre principios de diseño de experiencia de usuario e interfaces",
    startDate: "2023-12-05T09:00:00",
    endDate: "2023-12-06T17:00:00",
    location: "Laboratorio de Diseño, Edificio de Artes",
    type: "workshop",
    status: "completed",
    capacity: 20,
    registeredAttendees: 18,
    organizerId: "2",
    organizerName: "María López",
    createdAt: "2023-10-20T15:30:00",
    updatedAt: "2023-12-07T11:15:00",
    isPublished: true,
    tags: ["2", "10"],
  },
  {
    id: "8",
    title: "Seminario de Innovación Educativa",
    description: "Seminario sobre nuevas metodologías y tecnologías para la educación",
    startDate: "2024-01-15T14:00:00",
    endDate: "2024-01-15T18:00:00",
    location: "Sala de Conferencias, Facultad de Educación",
    type: "seminar",
    status: "active",
    capacity: 60,
    registeredAttendees: 45,
    organizerId: "3",
    organizerName: "Juan Pérez",
    createdAt: "2023-11-30T09:20:00",
    updatedAt: "2024-01-10T16:45:00",
    isPublished: true,
    tags: ["3", "11"],
  },
  {
    id: "9",
    title: "Curso de Análisis de Datos con R",
    description: "Curso intensivo sobre análisis estadístico y visualización de datos con R",
    startDate: "2024-02-10T09:00:00",
    endDate: "2024-02-14T13:00:00",
    location: "Laboratorio de Estadística, Edificio de Ciencias",
    type: "course",
    status: "scheduled",
    capacity: 25,
    registeredAttendees: 20,
    organizerId: "4",
    organizerName: "Ana García",
    createdAt: "2023-12-15T11:10:00",
    updatedAt: "2024-01-20T14:30:00",
    isPublished: true,
    tags: ["2", "4", "12"],
  },
  {
    id: "10",
    title: "Reunión de Planificación Estratégica",
    description: "Reunión para definir objetivos y estrategias institucionales para el próximo año",
    startDate: "2024-03-05T10:00:00",
    endDate: "2024-03-05T16:00:00",
    location: "Sala de Juntas, Edificio Administrativo",
    type: "meeting",
    status: "scheduled",
    capacity: 20,
    registeredAttendees: 0,
    organizerId: "5",
    organizerName: "Roberto Sánchez",
    createdAt: "2024-01-20T08:45:00",
    updatedAt: "2024-01-20T08:45:00",
    isPublished: false,
    tags: ["8", "13"],
  },
]

const mockOrganizers: Organizer[] = [
  {
    id: "1",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@example.com",
    department: "Tecnología",
  },
  {
    id: "2",
    name: "María López",
    email: "maria.lopez@example.com",
    department: "Marketing",
  },
  {
    id: "3",
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    department: "Ventas",
  },
  {
    id: "4",
    name: "Ana García",
    email: "ana.garcia@example.com",
    department: "Recursos Humanos",
  },
  {
    id: "5",
    name: "Roberto Sánchez",
    email: "roberto.sanchez@example.com",
    department: "Finanzas",
  },
  {
    id: "6",
    name: "Laura Martínez",
    email: "laura.martinez@example.com",
    department: "Operaciones",
  },
  {
    id: "7",
    name: "Pedro Rodríguez",
    email: "pedro.rodriguez@example.com",
    department: "Investigación",
  },
  {
    id: "8",
    name: "Sofía Hernández",
    email: "sofia.hernandez@example.com",
    department: "Desarrollo",
  },
]

const mockTags: EventTag[] = [
  { id: "1", name: "Tecnología", color: "#1C8443" },
  { id: "2", name: "Educación", color: "#41AD49" },
  { id: "3", name: "Investigación", color: "#8DC642" },
  { id: "4", name: "Programación", color: "#67DCD7" },
  { id: "5", name: "Inteligencia Artificial", color: "#38A2C1" },
  { id: "6", name: "Ciencia", color: "#4A6FA5" },
  { id: "7", name: "Python", color: "#FFD43B" },
  { id: "8", name: "Administración", color: "#FF6B6B" },
  { id: "9", name: "Medio Ambiente", color: "#20BF55" },
  { id: "10", name: "Diseño", color: "#8A2BE2" },
  { id: "11", name: "Innovación", color: "#FF7F50" },
  { id: "12", name: "Análisis de Datos", color: "#6A5ACD" },
  { id: "13", name: "Estrategia", color: "#FF4500" },
]

const eventTypes = [
  { value: "conference", label: "Conferencia" },
  { value: "workshop", label: "Taller" },
  { value: "seminar", label: "Seminario" },
  { value: "course", label: "Curso" },
  { value: "meeting", label: "Reunión" },
  { value: "other", label: "Otro" },
]

const eventStatuses = [
  { value: "draft", label: "Borrador" },
  { value: "scheduled", label: "Programado" },
  { value: "active", label: "Activo" },
  { value: "completed", label: "Completado" },
  { value: "cancelled", label: "Cancelado" },
]

export const Events: React.FC = () => {
  // Estado para eventos
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [currentEvent, setCurrentEvent] = useState<Partial<Event> | null>(null)
  const [isEventFormOpen, setIsEventFormOpen] = useState(false)
  const [isTransferOwnershipOpen, setIsTransferOwnershipOpen] = useState(false)
  const [eventToTransfer, setEventToTransfer] = useState<Event | null>(null)
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false)
  const [isDeleteEventDialogOpen, setIsDeleteEventDialogOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null)
  const [isDeleteMultipleDialogOpen, setIsDeleteMultipleDialogOpen] = useState(false)

  // Estado para filtros
  const [filters, setFilters] = useState<EventFilters>({
    search: "",
    dateRange: {
      from: null,
      to: null,
    },
    status: "all",
    type: "all",
    organizer: "",
    tags: [],
    isPublished: null,
  })

  // Estado para ordenación
  const [sortColumn, setSortColumn] = useState<string>("startDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Calcular estadísticas
  const calculateStats = (): EventStats => {
    const total = events.length
    const active = events.filter((e) => e.status === "active").length
    const upcoming = events.filter((e) => e.status === "scheduled").length
    const completed = events.filter((e) => e.status === "completed").length
    const cancelled = events.filter((e) => e.status === "cancelled").length
    const totalAttendees = events.reduce((sum, event) => sum + event.registeredAttendees, 0)
    const averageCapacity = Math.round(events.reduce((sum, event) => sum + event.capacity, 0) / (total || 1))

    return {
      total,
      active,
      upcoming,
      completed,
      cancelled,
      totalAttendees,
      averageCapacity,
    }
  }

  // Filtrar y ordenar eventos
  const filteredAndSortedEvents = events
    .filter((event) => {
      // Filtro de búsqueda
      if (
        filters.search &&
        !event.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !event.description.toLowerCase().includes(filters.search.toLowerCase()) &&
        !event.location.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false
      }

      // Filtro de tipo
      if (filters.type !== "all" && event.type !== filters.type) {
        return false
      }

      // Filtro de estado
      if (filters.status !== "all" && event.status !== filters.status) {
        return false
      }

      // Filtro de organizador
      if (filters.organizer && event.organizerId !== filters.organizer) {
        return false
      }

      // Filtro de fecha
      if (filters.dateRange.from || filters.dateRange.to) {
        const eventDate = new Date(event.startDate)

        if (filters.dateRange.from && eventDate < filters.dateRange.from) {
          return false
        }

        if (filters.dateRange.to) {
          const endDate = new Date(filters.dateRange.to)
          endDate.setHours(23, 59, 59, 999)
          if (eventDate > endDate) {
            return false
          }
        }
      }

      // Filtro de publicación
      if (filters.isPublished !== null && event.isPublished !== filters.isPublished) {
        return false
      }

      // Filtro de etiquetas
      if (filters.tags.length > 0) {
        const hasAllTags = filters.tags.every((tagId) => event.tags.includes(tagId))
        if (!hasAllTags) {
          return false
        }
      }

      return true
    })
    .sort((a, b) => {
      // Ordenar por columna seleccionada
      let aValue: any = a[sortColumn as keyof Event]
      let bValue: any = b[sortColumn as keyof Event]

      // Manejar casos especiales
      if (
        sortColumn === "startDate" ||
        sortColumn === "endDate" ||
        sortColumn === "createdAt" ||
        sortColumn === "updatedAt"
      ) {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1
      }
      return 0
    })

  // Manejadores para eventos
  const handleFilterChange = (newFilters: EventFilters) => {
    setFilters(newFilters)
  }

  const handleResetFilters = () => {
    setFilters({
      search: "",
      dateRange: {
        from: null,
        to: null,
      },
      status: "all",
      type: "all",
      organizer: "",
      tags: [],
      isPublished: null,
    })
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleSelectEvent = (eventId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedEvents([...selectedEvents, eventId])
    } else {
      setSelectedEvents(selectedEvents.filter((id) => id !== eventId))
    }
  }

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedEvents(filteredAndSortedEvents.map((event) => event.id))
    } else {
      setSelectedEvents([])
    }
  }

  const handleCreateEvent = () => {
    setCurrentEvent({})
    setIsEventFormOpen(true)
  }

  const handleEditEvent = (event: Event) => {
    setCurrentEvent(event)
    setIsEventFormOpen(true)
  }

  const handleViewEvent = (event: Event) => {
    // En una aplicación real, aquí se navegaría a la vista detallada del evento
    console.log("Ver detalles del evento:", event.id)
    alert(`Ver detalles del evento: ${event.title}`)
  }

  const handleDeleteEvent = (event: Event) => {
    setEventToDelete(event)
    setIsDeleteEventDialogOpen(true)
  }

  const confirmDeleteEvent = () => {
    if (eventToDelete) {
      setEvents(events.filter((e) => e.id !== eventToDelete.id))
      setIsDeleteEventDialogOpen(false)
      setEventToDelete(null)
      // Si el evento eliminado estaba seleccionado, quitarlo de la selección
      setSelectedEvents(selectedEvents.filter((id) => id !== eventToDelete.id))
    }
  }

  const handleDeleteMultiple = () => {
    if (selectedEvents.length > 0) {
      setIsDeleteMultipleDialogOpen(true)
    }
  }

  const confirmDeleteMultiple = () => {
    setEvents(events.filter((e) => !selectedEvents.includes(e.id)))
    setSelectedEvents([])
    setIsDeleteMultipleDialogOpen(false)
  }

  const handleDuplicateEvent = (event: Event) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
      title: `${event.title} (Copia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: false,
      status: "draft",
    }
    setEvents([...events, newEvent])
  }

  const handlePublishEvent = (event: Event) => {
    setEvents(
      events.map((e) => {
        if (e.id === event.id) {
          return {
            ...e,
            isPublished: !e.isPublished,
            updatedAt: new Date().toISOString(),
          }
        }
        return e
      }),
    )
  }

  const handleTransferOwnership = (event: Event) => {
    setEventToTransfer(event)
    setIsTransferOwnershipOpen(true)
  }

  const handleSubmitTransferOwnership = (eventId: string, newOrganizerId: string) => {
    const newOrganizer = mockOrganizers.find((o) => o.id === newOrganizerId)
    if (newOrganizer) {
      setEvents(
        events.map((e) => {
          if (e.id === eventId) {
            return {
              ...e,
              organizerId: newOrganizerId,
              organizerName: newOrganizer.name,
              updatedAt: new Date().toISOString(),
            }
          }
          return e
        }),
      )
    }
    setIsTransferOwnershipOpen(false)
    setEventToTransfer(null)
  }

  const handleGenerateCertificates = (event: Event) => {
    // En una aplicación real, aquí se generarían las constancias
    console.log("Generar constancias para el evento:", event.id)
    alert(`Generando constancias para ${event.registeredAttendees} asistentes del evento: ${event.title}`)
  }

  const handleBulkEdit = () => {
    if (selectedEvents.length > 0) {
      setIsBulkEditOpen(true)
    }
  }

  const handleSubmitBulkEdit = (changes: BulkEditChanges) => {
    setEvents(
      events.map((event) => {
        if (selectedEvents.includes(event.id)) {
          const updatedEvent = { ...event }

          if (changes.type) {
            updatedEvent.type = changes.type
          }

          if (changes.status) {
            updatedEvent.status = changes.status
          }

          if (changes.isPublished !== undefined) {
            updatedEvent.isPublished = changes.isPublished
          }

          if (changes.addTags && changes.addTags.length > 0) {
            const newTags = [...updatedEvent.tags]
            changes.addTags.forEach((tagId) => {
              if (!newTags.includes(tagId)) {
                newTags.push(tagId)
              }
            })
            updatedEvent.tags = newTags
          }

          if (changes.removeTags && changes.removeTags.length > 0) {
            updatedEvent.tags = updatedEvent.tags.filter((tagId) => !changes.removeTags?.includes(tagId))
          }

          updatedEvent.updatedAt = new Date().toISOString()
          return updatedEvent
        }
        return event
      }),
    )
    setIsBulkEditOpen(false)
  }

  const handleSubmitEvent = (eventData: Partial<Event>) => {
    if (eventData.id) {
      // Actualizar evento existente
      setEvents(
        events.map((e) => {
          if (e.id === eventData.id) {
            return {
              ...e,
              ...eventData,
              updatedAt: new Date().toISOString(),
            }
          }
          return e
        }),
      )
    } else {
      // Crear nuevo evento
      const newEvent: Event = {
        id: Date.now().toString(),
        title: eventData.title || "Nuevo Evento",
        description: eventData.description || "",
        startDate: eventData.startDate || new Date().toISOString(),
        endDate: eventData.endDate || new Date().toISOString(),
        location: eventData.location || "",
        type: eventData.type || "conference",
        status: eventData.status || "draft",
        capacity: eventData.capacity || 100,
        registeredAttendees: 0,
        organizerId: "1", // Por defecto, asignar al primer organizador
        organizerName: "Carlos Mendoza",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublished: eventData.isPublished || false,
        tags: eventData.tags || [],
      }
      setEvents([...events, newEvent])
    }
    setIsEventFormOpen(false)
    setCurrentEvent(null)
  }

  // Manejador de exportación
  const handleExport = (format: "csv" | "excel" | "pdf") => {
    // En una aplicación real, aquí se generaría el archivo correspondiente
    console.log(`Exportando eventos en formato ${format}`)
    alert(`Exportación en formato ${format} iniciada para ${filteredAndSortedEvents.length} eventos`)
  }

  return (
    <AdminLayout title="Eventos">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Administración de Eventos</h1>
            <p className="text-muted-foreground">Gestiona todos los eventos del sistema</p>
          </div>
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Exportar como CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("excel")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Exportar como Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("pdf")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Exportar como PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {selectedEvents.length > 0 && (
              <>
                <Button variant="outline" onClick={handleBulkEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edición masiva ({selectedEvents.length})
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleDeleteMultiple}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar seleccionados
                </Button>
              </>
            )}

            <Button onClick={handleCreateEvent} className="bg-[#1C8443] hover:bg-[#1C8443]/90">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Evento
            </Button>
          </div>
        </div>

        <EventStatsComponent stats={calculateStats()} />

        <EventFiltersComponent
          filters={filters}
          eventTypes={eventTypes}
          eventStatuses={eventStatuses}
          organizers={mockOrganizers}
          tags={mockTags}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        <EventsTable
          events={filteredAndSortedEvents}
          selectedEvents={selectedEvents}
          onSelectEvent={handleSelectEvent}
          onSelectAll={handleSelectAll}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          onDuplicate={handleDuplicateEvent}
          onView={handleViewEvent}
          onPublish={handlePublishEvent}
          onTransferOwnership={handleTransferOwnership}
          onGenerateCertificates={handleGenerateCertificates}
          onSort={handleSort}
        />
      </div>

      {/* Modales y diálogos */}
      <EventForm
        isOpen={isEventFormOpen}
        onClose={() => setIsEventFormOpen(false)}
        event={currentEvent}
        eventTypes={eventTypes}
        eventStatuses={eventStatuses}
        tags={mockTags}
        onSubmit={handleSubmitEvent}
      />

      <TransferOwnershipDialog
        isOpen={isTransferOwnershipOpen}
        onClose={() => setIsTransferOwnershipOpen(false)}
        event={eventToTransfer}
        organizers={mockOrganizers}
        onSubmit={handleSubmitTransferOwnership}
      />

      <BulkEditDialog
        isOpen={isBulkEditOpen}
        onClose={() => setIsBulkEditOpen(false)}
        selectedCount={selectedEvents.length}
        eventTypes={eventTypes}
        eventStatuses={eventStatuses}
        tags={mockTags}
        onSubmit={handleSubmitBulkEdit}
      />

      <AlertDialog open={isDeleteEventDialogOpen} onOpenChange={setIsDeleteEventDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el evento
              {eventToDelete && ` "${eventToDelete.title}"`} y toda su información asociada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteEvent} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteMultipleDialogOpen} onOpenChange={setIsDeleteMultipleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminarán permanentemente {selectedEvents.length} eventos
              seleccionados y toda su información asociada.
              <div className="mt-2 flex items-center text-amber-600">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span>Esta es una acción destructiva que puede afectar a múltiples eventos.</span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteMultiple}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Eliminar {selectedEvents.length} eventos
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  )
}
