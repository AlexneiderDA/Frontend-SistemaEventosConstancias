"use client"

import type React from "react"
import { useState } from "react"
import { Search, Plus, Mail, Check, X, Copy, Trash, Edit } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Badge } from "../../ui/badge"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import type { EmailTemplate, EmailTemplateType } from "../../../types/email-template"


interface TemplatesListProps {
  templates: EmailTemplate[]
  onCreateTemplate: () => void
  onEditTemplate: (template: EmailTemplate) => void
  onDuplicateTemplate: (template: EmailTemplate) => void
  onDeleteTemplate: (templateId: string) => void
  onToggleActive: (templateId: string, isActive: boolean) => void
}

export const TemplatesList: React.FC<TemplatesListProps> = ({
  templates,
  onCreateTemplate,
  onEditTemplate,
  onDuplicateTemplate,
  onDeleteTemplate,
  onToggleActive,
}) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const getTemplateTypeLabel = (type: EmailTemplateType): string => {
    const labels: Record<EmailTemplateType, string> = {
      welcome: "Bienvenida",
      event_invitation: "Invitación a evento",
      event_reminder: "Recordatorio de evento",
      event_confirmation: "Confirmación de evento",
      certificate_issued: "Emisión de constancia",
      password_reset: "Restablecimiento de contraseña",
      account_verification: "Verificación de cuenta",
      custom: "Personalizado",
    }
    return labels[type] || type
  }

  const filteredTemplates = templates.filter((template) => {
    // Filtrar por búsqueda
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase())

    // Filtrar por tipo
    const matchesType = typeFilter === "all" || template.type === typeFilter

    // Filtrar por estado
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && template.isActive) ||
      (statusFilter === "inactive" && !template.isActive)

    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 w-full md:max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar plantillas..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Tipo de plantilla" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectGroup>
                <SelectLabel>Tipos de plantilla</SelectLabel>
                <SelectItem value="welcome">Bienvenida</SelectItem>
                <SelectItem value="event_invitation">Invitación a evento</SelectItem>
                <SelectItem value="event_reminder">Recordatorio de evento</SelectItem>
                <SelectItem value="event_confirmation">Confirmación de evento</SelectItem>
                <SelectItem value="certificate_issued">Emisión de constancia</SelectItem>
                <SelectItem value="password_reset">Restablecimiento de contraseña</SelectItem>
                <SelectItem value="account_verification">Verificación de cuenta</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="active">Activas</SelectItem>
              <SelectItem value="inactive">Inactivas</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={onCreateTemplate} className="bg-[#1C8443] hover:bg-[#1C8443]/90">
            <Plus className="mr-2 h-4 w-4" />
            Nueva plantilla
          </Button>
        </div>
      </div>

      {filteredTemplates.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <Mail className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-lg font-medium">No se encontraron plantillas</h3>
            <p className="text-muted-foreground mt-2">
              {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                ? "Intenta con otros filtros de búsqueda"
                : "Crea tu primera plantilla de correo para comenzar"}
            </p>
            {!searchQuery && typeFilter === "all" && statusFilter === "all" && (
              <Button variant="outline" className="mt-4" onClick={onCreateTemplate}>
                <Plus className="mr-2 h-4 w-4" />
                Crear plantilla
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className={!template.isActive ? "opacity-70" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="mt-1">{getTemplateTypeLabel(template.type)}</CardDescription>
                  </div>
                  <Badge variant={template.isActive ? "default" : "outline"}>
                    {template.isActive ? "Activa" : "Inactiva"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm font-medium">Asunto:</p>
                <p className="text-sm text-muted-foreground truncate">{template.subject}</p>

                <div className="mt-2">
                  <p className="text-sm font-medium">Última actualización:</p>
                  <p className="text-sm text-muted-foreground">{new Date(template.updatedAt).toLocaleDateString()}</p>
                </div>

                {template.lastSentAt && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Último envío:</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(template.lastSentAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button variant="ghost" size="sm" onClick={() => onToggleActive(template.id, !template.isActive)}>
                  {template.isActive ? (
                    <>
                      <X className="mr-1 h-4 w-4" />
                      Desactivar
                    </>
                  ) : (
                    <>
                      <Check className="mr-1 h-4 w-4" />
                      Activar
                    </>
                  )}
                </Button>

                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onDuplicateTemplate(template)} title="Duplicar">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEditTemplate(template)} title="Editar">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteTemplate(template.id)}
                    title="Eliminar"
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
