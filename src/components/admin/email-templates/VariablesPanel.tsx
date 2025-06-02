"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import type { EmailVariable } from "@/types/email-template"

interface VariablesPanelProps {
  onInsertVariable: (variable: string) => void
}

export const VariablesPanel: React.FC<VariablesPanelProps> = ({ onInsertVariable }) => {
  // Variables disponibles agrupadas por categoría
  const variables: Record<string, EmailVariable[]> = {
    user: [
      { key: "user.name", description: "Nombre completo del usuario", example: "Juan Pérez", category: "user" },
      { key: "user.firstName", description: "Nombre del usuario", example: "Juan", category: "user" },
      { key: "user.lastName", description: "Apellido del usuario", example: "Pérez", category: "user" },
      { key: "user.email", description: "Correo electrónico", example: "juan.perez@ejemplo.com", category: "user" },
      { key: "user.role", description: "Rol del usuario", example: "Administrador", category: "user" },
    ],
    event: [
      { key: "event.name", description: "Nombre del evento", example: "Conferencia Anual", category: "event" },
      { key: "event.date", description: "Fecha del evento", example: "15/10/2023", category: "event" },
      { key: "event.time", description: "Hora del evento", example: "14:00", category: "event" },
      { key: "event.location", description: "Ubicación del evento", example: "Auditorio Principal", category: "event" },
      {
        key: "event.description",
        description: "Descripción del evento",
        example: "Conferencia sobre tecnologías emergentes",
        category: "event",
      },
      {
        key: "event.organizer",
        description: "Organizador del evento",
        example: "Departamento de Tecnología",
        category: "event",
      },
    ],
    certificate: [
      { key: "certificate.id", description: "ID de la constancia", example: "CERT-12345", category: "certificate" },
      { key: "certificate.issueDate", description: "Fecha de emisión", example: "20/10/2023", category: "certificate" },
      { key: "certificate.validUntil", description: "Válido hasta", example: "20/10/2025", category: "certificate" },
      {
        key: "certificate.verificationUrl",
        description: "URL de verificación",
        example: "https://ejemplo.com/verificar/CERT-12345",
        category: "certificate",
      },
    ],
    system: [
      {
        key: "system.siteName",
        description: "Nombre del sitio",
        example: "Sistema de Eventos y Constancias",
        category: "system",
      },
      {
        key: "system.siteUrl",
        description: "URL del sitio",
        example: "https://eventos.ejemplo.com",
        category: "system",
      },
      {
        key: "system.contactEmail",
        description: "Correo de contacto",
        example: "contacto@ejemplo.com",
        category: "system",
      },
      { key: "system.currentDate", description: "Fecha actual", example: "12/05/2023", category: "system" },
    ],
  }

  const handleInsert = (variable: string) => {
    onInsertVariable(`{{${variable}}}`)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Variables disponibles</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="user">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="user">Usuario</TabsTrigger>
            <TabsTrigger value="event">Evento</TabsTrigger>
            <TabsTrigger value="certificate">Constancia</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
          </TabsList>
          
          {Object.keys(variables).map((category) => (
            <TabsContent key={category} value={category} className="p-4 space-y-4">
              <div className="space-y-2">
                {variables[category].map((variable) => (
                  <div key={variable.key} className="border rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{`{{${variable.key}}}`}</p>
                        <p className="text-xs text-muted-foreground">{variable.description}</p>
                      </div>
                      <Button 
                        variant="ghost"
                        size="sm" 
                        onClick={() => handleInsert(variable.key)}
                        className="h-7 px-2"
                      >
                        Insertar
                      </Button>
                    </div>
                    <div className="mt-2 text-xs bg-muted p-1 rounded">
                      <span className="text-muted-foreground">Ejemplo: </span>
                      <span>{variable.example}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-xs text-muted-foreground">
                <p>Para usar estas variables, insértalas en tu plantilla con el formato {{'{{\'}}variable{\'}}'}}.</p>\
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
