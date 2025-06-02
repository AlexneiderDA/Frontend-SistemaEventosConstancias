"use client"

import type React from "react"
import { useState } from "react"
import { AdminLayout } from "@/components/admin/layouts/AdminLayout"
import { TemplateLibrary } from "@/components/admin/certificates/TemplateLibrary"
import { TemplateEditor } from "@/components/admin/certificates/TemplateEditor"
import { TemplatePreview } from "@/components/admin/certificates/TemplatePreview"
import { DefaultTemplateDialog } from "@/components/admin/certificates/DefaultTemplateDialog"
import { DeleteTemplateDialog } from "@/components/admin/certificates/DeleteTemplateDialog"
import type { CertificateTemplate, CertificateVariable, TemplateFilter } from "@/types/certificate"

// Resto del archivo permanece igual...
const mockTemplates: CertificateTemplate[] = [
  {
    id: "1",
    name: "Constancia de Participación",
    description: "Plantilla estándar para constancias de participación en eventos",
    thumbnail: "/placeholder.svg?height=300&width=400",
    content: `
      <div style="text-align: center; font-family: Arial, sans-serif;">
        <img src="/placeholder.svg?height=100&width=300" alt="Logo" style="max-width: 300px; margin-bottom: 20px;">
        <h1 style="color: #1C8443; margin-bottom: 30px;">CONSTANCIA DE PARTICIPACIÓN</h1>
        <p style="font-size: 18px; margin-bottom: 20px;">Se otorga la presente constancia a:</p>
        <h2 style="font-size: 24px; color: #38A2C1; margin-bottom: 30px;">{{participant.name}}</h2>
        <p style="font-size: 18px; margin-bottom: 30px;">Por su valiosa participación en el evento:</p>
        <h3 style="font-size: 20px; color: #41AD49; margin-bottom: 30px;">{{event.name}}</h3>
        <p style="font-size: 16px; margin-bottom: 20px;">Realizado el {{event.date}} en {{event.location}}</p>
        <p style="font-size: 16px; margin-bottom: 40px;">Con una duración de {{event.duration}}</p>
        <div style="margin-top: 60px; display: flex; justify-content: space-around;">
          <div style="text-align: center; width: 200px;">
            <div style="border-top: 1px solid #000; padding-top: 10px;">
              <p style="margin: 0;">{{organization.name}}</p>
              <p style="margin: 0; font-style: italic;">Organizador</p>
            </div>
          </div>
        </div>
        <p style="margin-top: 40px; font-size: 12px; color: #666;">ID de verificación: {{participant.id}}</p>
      </div>
    `,
    isDefault: true,
    eventTypes: ["conference", "seminar"],
    createdAt: "2023-01-15T10:30:00",
    updatedAt: "2023-03-20T14:45:00",
    createdBy: "Admin",
    lastModifiedBy: "Admin",
  },
  {
    id: "2",
    name: "Certificado de Asistencia a Taller",
    description: "Plantilla para talleres y cursos prácticos",
    thumbnail: "/placeholder.svg?height=300&width=400",
    content: `
      <div style="text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; border: 10px solid #8DC642;">
        <div style="padding: 20px; border: 2px solid #1C8443;">
          <img src="/placeholder.svg?height=80&width=250" alt="Logo" style="max-width: 250px; margin-bottom: 20px;">
          <h1 style="color: #1C8443; margin-bottom: 20px; text-transform: uppercase;">Certificado de Asistencia</h1>
          <p style="font-size: 16px; margin-bottom: 10px;">El presente certifica que:</p>
          <h2 style="font-size: 28px; color: #38A2C1; margin-bottom: 20px; font-weight: bold;">{{participant.name}}</h2>
          <p style="font-size: 16px; margin-bottom: 10px;">Ha completado satisfactoriamente el taller:</p>
          <h3 style="font-size: 22px; color: #41AD49; margin-bottom: 20px; font-weight: bold;">{{event.name}}</h3>
          <p style="font-size: 16px; margin-bottom: 10px;">Impartido por {{event.organizer}}</p>
          <p style="font-size: 16px; margin-bottom: 30px;">El día {{event.date}} en {{event.location}}</p>
          <div style="margin-top: 40px; display: flex; justify-content: space-around;">
            <div style="text-align: center; width: 200px;">
              <div style="border-top: 1px solid #000; padding-top: 10px;">
                <p style="margin: 0;">{{organization.name}}</p>
                <p style="margin: 0; font-style: italic;">Director</p>
              </div>
            </div>
            <div style="text-align: center; width: 200px;">
              <div style="border-top: 1px solid #000; padding-top: 10px;">
                <p style="margin: 0;">{{event.organizer}}</p>
                <p style="margin: 0; font-style: italic;">Instructor</p>
              </div>
            </div>
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #666;">Certificado emitido el {{date.fullDate}}</p>
        </div>
      </div>
    `,
    isDefault: true,
    eventTypes: ["workshop", "course"],
    createdAt: "2023-02-10T09:15:00",
    updatedAt: "2023-04-05T11:30:00",
    createdBy: "Admin",
    lastModifiedBy: "Admin",
  },
  {
    id: "3",
    name: "Reconocimiento para Ponentes",
    description: "Plantilla para reconocer a ponentes y expositores",
    thumbnail: "/placeholder.svg?height=300&width=400",
    content: `
      <div style="text-align: center; font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif; background-color: #f9f9f9; padding: 30px;">
        <img src="/placeholder.svg?height=120&width=320" alt="Logo" style="max-width: 320px; margin-bottom: 30px;">
        <h1 style="color: #1C8443; margin-bottom: 30px; font-size: 32px;">RECONOCIMIENTO</h1>
        <p style="font-size: 18px; margin-bottom: 20px;">La {{organization.name}} otorga el presente reconocimiento a:</p>
        <h2 style="font-size: 30px; color: #38A2C1; margin-bottom: 30px; font-weight: bold;">{{participant.name}}</h2>
        <p style="font-size: 18px; margin-bottom: 20px;">Por su valiosa participación como <strong>PONENTE</strong> en:</p>
        <h3 style="font-size: 24px; color: #41AD49; margin-bottom: 30px;">{{event.name}}</h3>
        <p style="font-size: 16px; margin-bottom: 20px;">Realizado el {{event.date}} en {{event.location}}</p>
        <p style="font-size: 16px; margin-bottom: 40px;">Agradecemos su contribución al conocimiento y desarrollo académico.</p>
        <div style="margin-top: 60px; display: flex; justify-content: center;">
          <div style="text-align: center; width: 250px;">
            <div style="border-top: 1px solid #000; padding-top: 10px;">
              <p style="margin: 0; font-weight: bold;">{{organization.department}}</p>
              <p style="margin: 0; font-style: italic;">{{organization.name}}</p>
            </div>
          </div>
        </div>
        <p style="margin-top: 40px; font-size: 12px; color: #666;">Emitido en {{date.fullDate}}</p>
      </div>
    `,
    isDefault: false,
    eventTypes: ["conference", "seminar"],
    createdAt: "2023-03-05T13:20:00",
    updatedAt: "2023-03-05T13:20:00",
    createdBy: "Admin",
    lastModifiedBy: "Admin",
  },
]

// Datos de ejemplo para las variables disponibles
const mockVariables: CertificateVariable[] = [
  {
    id: "1",
    name: "Nombre del Participante",
    key: "participant.name",
    description: "Nombre completo del participante",
    category: "participant",
    example: "Juan Pérez",
  },
  {
    id: "2",
    name: "Email del Participante",
    key: "participant.email",
    description: "Correo electrónico del participante",
    category: "participant",
    example: "juan.perez@example.com",
  },
  {
    id: "3",
    name: "Rol del Participante",
    key: "participant.role",
    description: "Rol o función del participante en el evento",
    category: "participant",
    example: "Asistente",
  },
  {
    id: "4",
    name: "Organización del Participante",
    key: "participant.organization",
    description: "Organización o institución a la que pertenece el participante",
    category: "participant",
    example: "Universidad Nacional",
  },
  {
    id: "5",
    name: "ID del Participante",
    key: "participant.id",
    description: "Identificador único del participante",
    category: "participant",
    example: "12345",
  },
  {
    id: "6",
    name: "Nombre del Evento",
    key: "event.name",
    description: "Título o nombre del evento",
    category: "event",
    example: "Conferencia de Inteligencia Artificial",
  },
  {
    id: "7",
    name: "Fecha del Evento",
    key: "event.date",
    description: "Fecha en que se realizó el evento",
    category: "event",
    example: "15 de junio de 2023",
  },
  {
    id: "8",
    name: "Ubicación del Evento",
    key: "event.location",
    description: "Lugar donde se realizó el evento",
    category: "event",
    example: "Auditorio Principal, Campus Central",
  },
  {
    id: "9",
    name: "Organizador del Evento",
    key: "event.organizer",
    description: "Persona o entidad organizadora del evento",
    category: "event",
    example: "Facultad de Ingeniería",
  },
  {
    id: "10",
    name: "Duración del Evento",
    key: "event.duration",
    description: "Duración total del evento",
    category: "event",
    example: "8 horas",
  },
  {
    id: "11",
    name: "Nombre de la Organización",
    key: "organization.name",
    description: "Nombre de la institución o organización emisora",
    category: "organization",
    example: "Universidad Tecnológica",
  },
  {
    id: "12",
    name: "Logo de la Organización",
    key: "organization.logo",
    description: "URL del logo de la organización",
    category: "organization",
    example: "/logo.png",
  },
  {
    id: "13",
    name: "Departamento",
    key: "organization.department",
    description: "Departamento o área específica de la organización",
    category: "organization",
    example: "Facultad de Ciencias",
  },
  {
    id: "14",
    name: "Dirección",
    key: "organization.address",
    description: "Dirección física de la organización",
    category: "organization",
    example: "Av. Universidad 123, Ciudad Universitaria",
  },
  {
    id: "15",
    name: "Día",
    key: "date.day",
    description: "Día de emisión del certificado",
    category: "date",
    example: "15",
  },
  {
    id: "16",
    name: "Mes",
    key: "date.month",
    description: "Mes de emisión del certificado",
    category: "date",
    example: "junio",
  },
  {
    id: "17",
    name: "Año",
    key: "date.year",
    description: "Año de emisión del certificado",
    category: "date",
    example: "2023",
  },
  {
    id: "18",
    name: "Fecha Completa",
    key: "date.fullDate",
    description: "Fecha completa de emisión del certificado",
    category: "date",
    example: "15 de junio de 2023",
  },
]

// Tipos de eventos
const eventTypes = [
  { value: "conference", label: "Conferencia" },
  { value: "workshop", label: "Taller" },
  { value: "seminar", label: "Seminario" },
  { value: "course", label: "Curso" },
  { value: "meeting", label: "Reunión" },
  { value: "other", label: "Otro" },
]

export const CertificateTemplates: React.FC = () => {
  // Estado para las plantillas
  const [templates, setTemplates] = useState<CertificateTemplate[]>(mockTemplates)

  // Estado para los filtros
  const [filters, setFilters] = useState<TemplateFilter>({
    search: "",
    eventType: "",
    sortBy: "name",
    sortDirection: "asc",
    showOnlyDefault: false,
  })

  // Estado para la interfaz
  const [view, setView] = useState<"library" | "editor" | "preview">("library")
  const [currentTemplate, setCurrentTemplate] = useState<CertificateTemplate | null>(null)
  const [isDefaultDialogOpen, setIsDefaultDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<CertificateTemplate | null>(null)

  // Filtrar y ordenar plantillas
  const filteredTemplates = templates
    .filter((template) => {
      // Filtro de búsqueda
      if (
        filters.search &&
        !template.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !template.description.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false
      }

      // Filtro de tipo de evento
      if (filters.eventType && !template.eventTypes.includes(filters.eventType)) {
        return false
      }

      // Filtro de plantillas predeterminadas
      if (filters.showOnlyDefault && !template.isDefault) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      // Ordenar por columna seleccionada
      if (filters.sortBy === "name") {
        return filters.sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (filters.sortBy === "createdAt") {
        return filters.sortDirection === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (filters.sortBy === "updatedAt") {
        return filters.sortDirection === "asc"
          ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
      return 0
    })

  // Manejadores para la biblioteca de plantillas
  const handleFilterChange = (newFilters: TemplateFilter) => {
    setFilters(newFilters)
  }

  const handleCreateTemplate = () => {
    const newTemplate: CertificateTemplate = {
      id: Date.now().toString(),
      name: "Nueva Plantilla",
      description: "Descripción de la nueva plantilla",
      thumbnail: "",
      content: `
        <div style="text-align: center; font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #1C8443;">CONSTANCIA</h1>
          <p style="font-size: 18px; margin: 20px 0;">Se otorga la presente constancia a:</p>
          <h2 style="font-size: 24px; color: #38A2C1;">{{participant.name}}</h2>
          <p style="font-size: 18px; margin: 20px 0;">Por su participación en:</p>
          <h3 style="font-size: 20px; color: #41AD49;">{{event.name}}</h3>
          <p style="font-size: 16px; margin: 20px 0;">Fecha: {{event.date}}</p>
          <div style="margin-top: 60px; border-top: 1px solid #000; width: 200px; margin-left: auto; margin-right: auto; padding-top: 10px;">
            <p style="margin: 0;">{{organization.name}}</p>
          </div>
        </div>
      `,
      isDefault: false,
      eventTypes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "Usuario Actual",
      lastModifiedBy: "Usuario Actual",
    }

    setCurrentTemplate(newTemplate)
    setView("editor")
  }

  const handleEditTemplate = (template: CertificateTemplate) => {
    setCurrentTemplate(template)
    setView("editor")
  }

  const handleDuplicateTemplate = (template: CertificateTemplate) => {
    const duplicatedTemplate: CertificateTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copia)`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "Usuario Actual",
      lastModifiedBy: "Usuario Actual",
    }

    setTemplates([...templates, duplicatedTemplate])
  }

  const handleDeleteTemplate = (template: CertificateTemplate) => {
    setTemplateToDelete(template)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteTemplate = () => {
    if (templateToDelete) {
      setTemplates(templates.filter((t) => t.id !== templateToDelete.id))
      setIsDeleteDialogOpen(false)
      setTemplateToDelete(null)
    }
  }

  const handleSetDefaultTemplate = (template: CertificateTemplate) => {
    setCurrentTemplate(template)
    setIsDefaultDialogOpen(true)
  }

  const confirmSetDefaultTemplate = (template: CertificateTemplate, forEventTypes: string[]) => {
    // Actualizar las plantillas predeterminadas
    const updatedTemplates = templates.map((t) => {
      // Si la plantilla actual es para alguno de los tipos de eventos seleccionados,
      // quitarle el estado de predeterminada para esos tipos
      if (t.isDefault && t.id !== template.id) {
        const remainingTypes = t.eventTypes.filter((type) => !forEventTypes.includes(type))
        return {
          ...t,
          eventTypes: remainingTypes,
          isDefault: remainingTypes.length > 0,
          updatedAt: new Date().toISOString(),
          lastModifiedBy: "Usuario Actual",
        }
      }

      // Si es la plantilla que estamos configurando como predeterminada
      if (t.id === template.id) {
        // Combinar los tipos de eventos existentes con los nuevos
        const combinedTypes = [...new Set([...t.eventTypes, ...forEventTypes])]
        return {
          ...t,
          eventTypes: combinedTypes,
          isDefault: true,
          updatedAt: new Date().toISOString(),
          lastModifiedBy: "Usuario Actual",
        }
      }

      return t
    })

    setTemplates(updatedTemplates)
    setIsDefaultDialogOpen(false)
  }

  // Manejadores para el editor de plantillas
  const handleSaveTemplate = (updatedTemplate: CertificateTemplate) => {
    setTemplates(templates.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t)))
    setView("library")
    setCurrentTemplate(null)
  }

  const handlePreviewTemplate = (template: CertificateTemplate) => {
    setCurrentTemplate(template)
    setView("preview")
  }

  return (
    <AdminLayout title="Plantillas de Constancias">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Plantillas de Constancias</h1>
            <p className="text-muted-foreground">
              Gestiona y personaliza las plantillas para generar constancias de eventos
            </p>
          </div>
        </div>

        {view === "library" && (
          <TemplateLibrary
            templates={filteredTemplates}
            filters={filters}
            onFilterChange={handleFilterChange}
            onCreateTemplate={handleCreateTemplate}
            onEditTemplate={handleEditTemplate}
            onDuplicateTemplate={handleDuplicateTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            onSetDefaultTemplate={handleSetDefaultTemplate}
            eventTypes={eventTypes}
          />
        )}

        {view === "editor" && currentTemplate && (
          <TemplateEditor
            template={currentTemplate}
            variables={mockVariables}
            onSave={handleSaveTemplate}
            onBack={() => {
              setView("library")
              setCurrentTemplate(null)
            }}
            onPreview={handlePreviewTemplate}
          />
        )}

        {view === "preview" && currentTemplate && (
          <div className="h-[calc(100vh-200px)]">
            <div className="mb-4 flex justify-between items-center">
              <button
                onClick={() => setView("editor")}
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                ← Volver al editor
              </button>
            </div>
            <TemplatePreview template={currentTemplate} />
          </div>
        )}
      </div>

      {/* Diálogos */}
      {currentTemplate && (
        <DefaultTemplateDialog
          isOpen={isDefaultDialogOpen}
          onClose={() => setIsDefaultDialogOpen(false)}
          template={currentTemplate}
          eventTypes={eventTypes}
          onConfirm={confirmSetDefaultTemplate}
        />
      )}

      <DeleteTemplateDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        template={templateToDelete}
        onConfirm={confirmDeleteTemplate}
      />
    </AdminLayout>
  )
}
