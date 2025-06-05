"use client"

import type React from "react"
import { useState } from "react"
import { Download, ChevronLeft, ChevronRight, User } from "lucide-react"
import { Button } from "../../ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import type { CertificateTemplate } from "../../../types/certificate"


interface TemplatePreviewProps {
  template: CertificateTemplate
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template }) => {
  const [previewMode, setPreviewMode] = useState<"sample" | "real">("sample")
  const [currentParticipant, setCurrentParticipant] = useState(0)

  // Datos de ejemplo para la vista previa
  const sampleData = {
    participant: {
      name: "Juan Pérez",
      email: "juan.perez@example.com",
      role: "Asistente",
      organization: "Universidad Nacional",
      id: "12345",
    },
    event: {
      name: "Conferencia de Inteligencia Artificial",
      date: "15 de junio de 2023",
      location: "Auditorio Principal, Campus Central",
      organizer: "Facultad de Ingeniería",
      duration: "8 horas",
    },
    organization: {
      name: "Universidad Tecnológica",
      logo: "/placeholder.svg?height=100&width=300",
      department: "Facultad de Ciencias",
      address: "Av. Universidad 123, Ciudad Universitaria",
    },
    date: {
      day: "15",
      month: "junio",
      year: "2023",
      fullDate: "15 de junio de 2023",
    },
  }

  // Participantes de ejemplo para la vista previa "real"
  const sampleParticipants = [
    {
      name: "Juan Pérez",
      email: "juan.perez@example.com",
      role: "Asistente",
      organization: "Universidad Nacional",
      id: "12345",
    },
    {
      name: "María López",
      email: "maria.lopez@example.com",
      role: "Ponente",
      organization: "Instituto Tecnológico",
      id: "67890",
    },
    {
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@example.com",
      role: "Organizador",
      organization: "Facultad de Ciencias",
      id: "24680",
    },
  ]

  // Función para reemplazar variables en el contenido
  const replaceVariables = (content: string, data: any, participantIndex = 0) => {
    let result = content

    // Reemplazar variables de participante
    const participant = previewMode === "real" ? sampleParticipants[participantIndex] : data.participant

    result = result.replace(/{{participant\.name}}/g, participant.name)
    result = result.replace(/{{participant\.email}}/g, participant.email)
    result = result.replace(/{{participant\.role}}/g, participant.role)
    result = result.replace(/{{participant\.organization}}/g, participant.organization)
    result = result.replace(/{{participant\.id}}/g, participant.id)

    // Reemplazar variables de evento
    result = result.replace(/{{event\.name}}/g, data.event.name)
    result = result.replace(/{{event\.date}}/g, data.event.date)
    result = result.replace(/{{event\.location}}/g, data.event.location)
    result = result.replace(/{{event\.organizer}}/g, data.event.organizer)
    result = result.replace(/{{event\.duration}}/g, data.event.duration)

    // Reemplazar variables de organización
    result = result.replace(/{{organization\.name}}/g, data.organization.name)
    result = result.replace(/{{organization\.logo}}/g, data.organization.logo)
    result = result.replace(/{{organization\.department}}/g, data.organization.department)
    result = result.replace(/{{organization\.address}}/g, data.organization.address)

    // Reemplazar variables de fecha
    result = result.replace(/{{date\.day}}/g, data.date.day)
    result = result.replace(/{{date\.month}}/g, data.date.month)
    result = result.replace(/{{date\.year}}/g, data.date.year)
    result = result.replace(/{{date\.fullDate}}/g, data.date.fullDate)

    return result
  }

  const handlePreviousParticipant = () => {
    setCurrentParticipant((prev) => (prev > 0 ? prev - 1 : sampleParticipants.length - 1))
  }

  const handleNextParticipant = () => {
    setCurrentParticipant((prev) => (prev < sampleParticipants.length - 1 ? prev + 1 : 0))
  }

  const handleDownloadPDF = () => {
    // En una aplicación real, aquí se generaría el PDF
    alert("Descargando constancia en PDF...")
  }

  return (
    <div className="h-full flex flex-col">
      {/* Barra de herramientas de vista previa */}
      <div className="p-4 border-b flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-4">
          <div>
            <Select value={previewMode} onValueChange={(value) => setPreviewMode(value as "sample" | "real")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Modo de vista previa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sample">Datos de ejemplo</SelectItem>
                <SelectItem value="real">Participantes reales</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {previewMode === "real" && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePreviousParticipant}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 min-w-[200px]">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{sampleParticipants[currentParticipant].name}</span>
                <span className="text-xs text-muted-foreground">
                  ({currentParticipant + 1}/{sampleParticipants.length})
                </span>
              </div>
              <Button variant="outline" size="icon" onClick={handleNextParticipant}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <Button variant="outline" onClick={handleDownloadPDF} className="gap-1">
          <Download className="h-4 w-4" />
          Descargar PDF
        </Button>
      </div>

      {/* Vista previa del certificado */}
      <div className="flex-1 overflow-auto p-8 bg-gray-100 flex justify-center items-start">
        <div
          className="bg-white shadow-md"
          style={{
            width: "210mm",
            height: "297mm",
            transform: "scale(0.8)",
            transformOrigin: "top center",
          }}
        >
          <div
            className="w-full h-full p-[20mm]"
            dangerouslySetInnerHTML={{
              __html: replaceVariables(template.content, sampleData, currentParticipant),
            }}
          />
        </div>
      </div>
    </div>
  )
}
