"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Event, EventType, EventStatus, EventTag } from "@/types/event"

interface EventFormProps {
  isOpen: boolean
  onClose: () => void
  event: Partial<Event> | null
  eventTypes: { value: string; label: string }[]
  eventStatuses: { value: string; label: string }[]
  tags: EventTag[]
  onSubmit: (event: Partial<Event>) => void
}

export const EventForm: React.FC<EventFormProps> = ({
  isOpen,
  onClose,
  event,
  eventTypes,
  eventStatuses,
  tags,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Partial<Event>>(event || {})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    if (isOpen && event) {
      setFormData(event)
      setErrors({})
      setActiveTab("general")
    } else if (isOpen) {
      setFormData({
        title: "",
        description: "",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        location: "",
        type: "conference",
        status: "draft",
        capacity: 100,
        registeredAttendees: 0,
        isPublished: false,
        tags: [],
      })
      setErrors({})
      setActiveTab("general")
    }
  }, [isOpen, event])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error cuando el usuario escribe
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = Number.parseInt(value, 10)
    if (!isNaN(numValue)) {
      setFormData((prev) => ({ ...prev, [name]: numValue }))
    }

    // Limpiar error cuando el usuario escribe
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value as EventType }))
    if (errors.type) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.type
        return newErrors
      })
    }
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value as EventStatus }))
    if (errors.status) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.status
        return newErrors
      })
    }
  }

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, startDate: date.toISOString() }))
      if (errors.startDate) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.startDate
          return newErrors
        })
      }
    }
  }

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, endDate: date.toISOString() }))
      if (errors.endDate) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.endDate
          return newErrors
        })
      }
    }
  }

  const handlePublishedChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isPublished: checked }))
  }

  const handleTagToggle = (tagId: string) => {
    setFormData((prev) => {
      const currentTags = prev.tags || []
      return {
        ...prev,
        tags: currentTags.includes(tagId) ? currentTags.filter((id) => id !== tagId) : [...currentTags, tagId],
      }
    })
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title?.trim()) {
      newErrors.title = "El título es obligatorio"
    }

    if (!formData.startDate) {
      newErrors.startDate = "La fecha de inicio es obligatoria"
    }

    if (!formData.endDate) {
      newErrors.endDate = "La fecha de fin es obligatoria"
    } else if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = "La fecha de fin debe ser posterior a la fecha de inicio"
    }

    if (!formData.type) {
      newErrors.type = "El tipo de evento es obligatorio"
    }

    if (!formData.status) {
      newErrors.status = "El estado del evento es obligatorio"
    }

    if (formData.capacity !== undefined && formData.capacity <= 0) {
      newErrors.capacity = "La capacidad debe ser mayor que cero"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
    } else {
      // Si hay errores, cambiar a la pestaña correspondiente
      const errorFields = Object.keys(errors)
      if (errorFields.some((field) => ["title", "description", "type", "status"].includes(field))) {
        setActiveTab("general")
      } else if (errorFields.some((field) => ["startDate", "endDate", "location"].includes(field))) {
        setActiveTab("details")
      } else if (errorFields.some((field) => ["capacity", "registeredAttendees"].includes(field))) {
        setActiveTab("capacity")
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{event?.id ? "Editar Evento" : "Crear Nuevo Evento"}</DialogTitle>
          <DialogDescription>
            {event?.id
              ? "Modifica la información del evento existente."
              : "Completa el formulario para crear un nuevo evento."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="details">Detalles</TabsTrigger>
              <TabsTrigger value="capacity">Capacidad y Etiquetas</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Título
                </Label>
                <div className="col-span-3 space-y-1">
                  <Input
                    id="title"
                    name="title"
                    value={formData.title || ""}
                    onChange={handleChange}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                </div>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Descripción
                </Label>
                <div className="col-span-3 space-y-1">
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    rows={4}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Tipo
                </Label>
                <div className="col-span-3 space-y-1">
                  <Select value={formData.type} onValueChange={handleTypeChange}>
                    <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tipo de evento</SelectLabel>
                        {eventTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-red-500 text-xs">{errors.type}</p>}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Estado
                </Label>
                <div className="col-span-3 space-y-1">
                  <Select value={formData.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Estado del evento</SelectLabel>
                        {eventStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="text-red-500 text-xs">{errors.status}</p>}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">Publicación</div>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch id="event-published" checked={formData.isPublished} onCheckedChange={handlePublishedChange} />
                  <Label htmlFor="event-published">
                    {formData.isPublished ? "Evento publicado" : "Evento no publicado"}
                  </Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Fecha de inicio
                </Label>
                <div className="col-span-3 space-y-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          errors.startDate ? "border-red-500" : ""
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? (
                          format(new Date(formData.startDate), "PPP", { locale: es })
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate ? new Date(formData.startDate) : undefined}
                        onSelect={handleStartDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.startDate && <p className="text-red-500 text-xs">{errors.startDate}</p>}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  Fecha de fin
                </Label>
                <div className="col-span-3 space-y-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          errors.endDate ? "border-red-500" : ""
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? (
                          format(new Date(formData.endDate), "PPP", { locale: es })
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate ? new Date(formData.endDate) : undefined}
                        onSelect={handleEndDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.endDate && <p className="text-red-500 text-xs">{errors.endDate}</p>}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Ubicación
                </Label>
                <div className="col-span-3 space-y-1">
                  <Input
                    id="location"
                    name="location"
                    value={formData.location || ""}
                    onChange={handleChange}
                    className={errors.location ? "border-red-500" : ""}
                    placeholder="Ej: Auditorio Principal, Campus Universitario"
                  />
                  {errors.location && <p className="text-red-500 text-xs">{errors.location}</p>}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="capacity" className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">
                  Capacidad
                </Label>
                <div className="col-span-3 space-y-1">
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity || ""}
                    onChange={handleNumberChange}
                    className={errors.capacity ? "border-red-500" : ""}
                  />
                  {errors.capacity && <p className="text-red-500 text-xs">{errors.capacity}</p>}
                </div>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Etiquetas</Label>
                <div className="col-span-3 space-y-1">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <div
                        key={tag.id}
                        className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                          formData.tags?.includes(tag.id) ? "bg-opacity-100 text-white" : "bg-opacity-20 text-gray-700"
                        }`}
                        style={{
                          backgroundColor: formData.tags?.includes(tag.id) ? tag.color : `${tag.color}33`,
                        }}
                        onClick={() => handleTagToggle(tag.id)}
                      >
                        {tag.name}
                      </div>
                    ))}
                  </div>
                  {tags.length === 0 && <p className="text-sm text-muted-foreground">No hay etiquetas disponibles.</p>}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#1C8443] hover:bg-[#1C8443]/90">
              {event?.id ? "Guardar cambios" : "Crear evento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
