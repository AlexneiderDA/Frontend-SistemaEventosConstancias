"use client"

import type React from "react"
import { useState } from "react"
import { AdminLayout } from "../../components/admin/layouts/AdminLayout"
import { TemplatesList } from "../../components/admin/email-templates/TemplatesList"
import { TemplateEditor } from "../../components/admin/email-templates/TemplateEditor"
import { VariablesPanel } from "../../components/admin/email-templates/VariablesPanel"
import { TestEmailDialog } from "../../components/admin/email-templates/TestEmailDialog"
import { DeleteTemplateDialog } from "../../components/admin/email-templates/DeleteTemplateDialog"
import { Button } from "../../components/ui/button"
import { ArrowLeft, Send } from "lucide-react"
import type {
  EmailTemplate,
  EmailTemplateFormData,
  EmailPreviewData,
  SendTestEmailResponse,
} from "../../types/email-template"


// Resto del archivo permanece igual...
const mockTemplates: EmailTemplate[] = [
  {
    id: "1",
    name: "Bienvenida a nuevos usuarios",
    type: "welcome",
    subject: "Bienvenido a Sistema de Eventos y Constancias",
    htmlContent:
      '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">\n  <h1 style="color: #1C8443;">¡Bienvenido a nuestro sistema!</h1>\n  <p>Hola {{user.name}},</p>\n  <p>Gracias por registrarte en {{system.siteName}}. Estamos emocionados de tenerte como parte de nuestra comunidad.</p>\n  <p>Con tu cuenta, podrás:</p>\n  <ul>\n    <li>Registrarte en eventos</li>\n    <li>Obtener constancias de participación</li>\n    <li>Mantenerte informado sobre próximas actividades</li>\n  </ul>\n  <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>\n  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">\n    <p>Saludos,<br>El equipo de {{system.siteName}}</p>\n  </div>\n</div>',
    textContent:
      "Hola {{user.name}},\n\nGracias por registrarte en {{system.siteName}}. Estamos emocionados de tenerte como parte de nuestra comunidad.\n\nCon tu cuenta, podrás:\n- Registrarte en eventos\n- Obtener constancias de participación\n- Mantenerte informado sobre próximas actividades\n\nSi tienes alguna pregunta, no dudes en contactarnos.\n\nSaludos,\nEl equipo de {{system.siteName}}",
    isActive: true,
    isDefault: true,
    createdAt: "2023-01-15T10:30:00",
    updatedAt: "2023-04-20T14:15:00",
    lastSentAt: "2023-05-10T09:45:00",
  },
  {
    id: "2",
    name: "Recordatorio de evento",
    type: "event_reminder",
    subject: "Recordatorio: {{event.name}} - Mañana",
    htmlContent:
      '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">\n  <h1 style="color: #1C8443;">Recordatorio de evento</h1>\n  <p>Hola {{user.name}},</p>\n  <p>Te recordamos que mañana se llevará a cabo el evento <strong>{{event.name}}</strong>.</p>\n  <p><strong>Fecha:</strong> {{event.date}}<br>\n  <strong>Hora:</strong> {{event.time}}<br>\n  <strong>Lugar:</strong> {{event.location}}</p>\n  <p>No olvides llevar tu identificación para el registro.</p>\n  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">\n    <p>Saludos,<br>El equipo de {{system.siteName}}</p>\n  </div>\n</div>',
    textContent:
      "Hola {{user.name}},\n\nTe recordamos que mañana se llevará a cabo el evento {{event.name}}.\n\nFecha: {{event.date}}\nHora: {{event.time}}\nLugar: {{event.location}}\n\nNo olvides llevar tu identificación para el registro.\n\nSaludos,\nEl equipo de {{system.siteName}}",
    isActive: true,
    isDefault: true,
    createdAt: "2023-02-10T11:20:00",
    updatedAt: "2023-04-15T16:30:00",
    lastSentAt: "2023-05-09T08:00:00",
  },
  {
    id: "3",
    name: "Emisión de constancia",
    type: "certificate_issued",
    subject: "Tu constancia para {{event.name}} está disponible",
    htmlContent:
      '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">\n  <h1 style="color: #1C8443;">¡Tu constancia está lista!</h1>\n  <p>Hola {{user.name}},</p>\n  <p>Nos complace informarte que tu constancia de participación para el evento <strong>{{event.name}}</strong> ya está disponible.</p>\n  <p>Puedes descargarla desde tu perfil en nuestra plataforma o haciendo clic en el siguiente enlace:</p>\n  <p style="text-align: center;">\n    <a href="{{certificate.verificationUrl}}" style="display: inline-block; background-color: #1C8443; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Descargar constancia</a>\n  </p>\n  <p>ID de constancia: <strong>{{certificate.id}}</strong><br>\n  Fecha de emisión: {{certificate.issueDate}}</p>\n  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">\n    <p>Saludos,<br>El equipo de {{system.siteName}}</p>\n  </div>\n</div>',
    textContent:
      "Hola {{user.name}},\n\nNos complace informarte que tu constancia de participación para el evento {{event.name}} ya está disponible.\n\nPuedes descargarla desde tu perfil en nuestra plataforma o visitando: {{certificate.verificationUrl}}\n\nID de constancia: {{certificate.id}}\nFecha de emisión: {{certificate.issueDate}}\n\nSaludos,\nEl equipo de {{system.siteName}}",
    isActive: true,
    isDefault: true,
    createdAt: "2023-03-05T09:15:00",
    updatedAt: "2023-04-10T13:45:00",
    lastSentAt: "2023-05-08T14:30:00",
  },
  {
    id: "4",
    name: "Restablecimiento de contraseña",
    type: "password_reset",
    subject: "Restablecimiento de contraseña - {{system.siteName}}",
    htmlContent:
      '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">\n  <h1 style="color: #1C8443;">Restablecimiento de contraseña</h1>\n  <p>Hola,</p>\n  <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en {{system.siteName}}.</p>\n  <p>Si no solicitaste este cambio, puedes ignorar este correo y tu contraseña seguirá siendo la misma.</p>\n  <p>Para restablecer tu contraseña, haz clic en el siguiente enlace (válido por 24 horas):</p>\n  <p style="text-align: center;">\n    <a href="{{system.siteUrl}}/reset-password?token=TOKEN" style="display: inline-block; background-color: #1C8443; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Restablecer contraseña</a>\n  </p>\n  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">\n    <p>Saludos,<br>El equipo de {{system.siteName}}</p>\n  </div>\n</div>',
    textContent:
      "Hola,\n\nHemos recibido una solicitud para restablecer la contraseña de tu cuenta en {{system.siteName}}.\n\nSi no solicitaste este cambio, puedes ignorar este correo y tu contraseña seguirá siendo la misma.\n\nPara restablecer tu contraseña, visita el siguiente enlace (válido por 24 horas):\n{{system.siteUrl}}/reset-password?token=TOKEN\n\nSaludos,\nEl equipo de {{system.siteName}}",
    isActive: true,
    isDefault: true,
    createdAt: "2023-01-20T08:45:00",
    updatedAt: "2023-03-15T11:30:00",
    lastSentAt: "2023-05-10T16:20:00",
  },
  {
    id: "5",
    name: "Invitación a evento especial",
    type: "event_invitation",
    subject: "Invitación especial: {{event.name}}",
    htmlContent:
      '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">\n  <h1 style="color: #1C8443;">Invitación especial</h1>\n  <p>Hola {{user.name}},</p>\n  <p>Nos complace invitarte al evento <strong>{{event.name}}</strong>.</p>\n  <p><strong>Fecha:</strong> {{event.date}}<br>\n  <strong>Hora:</strong> {{event.time}}<br>\n  <strong>Lugar:</strong> {{event.location}}</p>\n  <p>{{event.description}}</p>\n  <p>Esperamos contar con tu valiosa presencia.</p>\n  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">\n    <p>Saludos,<br>{{event.organizer}}</p>\n  </div>\n</div>',
    textContent:
      "Hola {{user.name}},\n\nNos complace invitarte al evento {{event.name}}.\n\nFecha: {{event.date}}\nHora: {{event.time}}\nLugar: {{event.location}}\n\n{{event.description}}\n\nEsperamos contar con tu valiosa presencia.\n\nSaludos,\n{{event.organizer}}",
    isActive: false,
    isDefault: false,
    createdAt: "2023-04-01T10:00:00",
    updatedAt: "2023-04-25T15:20:00",
  },
]

export const EmailTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockTemplates)
  const [isEditing, setIsEditing] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(null)
  const [isTestEmailDialogOpen, setIsTestEmailDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<EmailTemplate | null>(null)

  // Manejadores para la lista de plantillas
  const handleCreateTemplate = () => {
    setCurrentTemplate(null)
    setIsEditing(true)
  }

  const handleEditTemplate = (template: EmailTemplate) => {
    setCurrentTemplate(template)
    setIsEditing(true)
  }

  const handleDuplicateTemplate = (template: EmailTemplate) => {
    const newTemplate: EmailTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (copia)`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastSentAt: undefined,
    }

    setTemplates([...templates, newTemplate])
  }

  const handleDeleteTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setTemplateToDelete(template)
      setIsDeleteDialogOpen(true)
    }
  }

  const confirmDeleteTemplate = () => {
    if (templateToDelete) {
      setTemplates(templates.filter((t) => t.id !== templateToDelete.id))
      setIsDeleteDialogOpen(false)
      setTemplateToDelete(null)
    }
  }

  const handleToggleActive = (templateId: string, isActive: boolean) => {
    setTemplates(
      templates.map((template) =>
        template.id === templateId ? { ...template, isActive, updatedAt: new Date().toISOString() } : template,
      ),
    )
  }

  // Manejadores para el editor de plantillas
  const handleSaveTemplate = (formData: EmailTemplateFormData) => {
    if (currentTemplate) {
      // Actualizar plantilla existente
      setTemplates(
        templates.map((template) =>
          template.id === currentTemplate.id
            ? {
                ...template,
                ...formData,
                updatedAt: new Date().toISOString(),
              }
            : template,
        ),
      )
    } else {
      // Crear nueva plantilla
      const newTemplate: EmailTemplate = {
        id: Date.now().toString(),
        ...formData,
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setTemplates([...templates, newTemplate])
    }

    setIsEditing(false)
    setCurrentTemplate(null)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setCurrentTemplate(null)
  }

  // Manejador para insertar variables
  const handleInsertVariable = (variable: string) => {
    if (!currentTemplate) return

    // Implementación básica - en una aplicación real, esto insertaría la variable en la posición del cursor
    alert(`Variable a insertar: ${variable}`)
  }

  // Manejadores para el envío de correos de prueba
  const handleOpenTestEmailDialog = () => {
    if (!currentTemplate) return
    setIsTestEmailDialogOpen(true)
  }

  const handleSendTestEmail = async (email: string): Promise<SendTestEmailResponse> => {
    // Simulación de envío de correo
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Correo de prueba enviado correctamente a ${email}`,
        })
      }, 1500)
    })
  }

  // Preparar datos para la vista previa del correo
  const getEmailPreviewData = (): EmailPreviewData => {
    if (currentTemplate) {
      return {
        to: "destinatario@ejemplo.com",
        subject: currentTemplate.subject,
        htmlContent: currentTemplate.htmlContent,
        textContent: currentTemplate.textContent,
      }
    }

    return {
      to: "",
      subject: "",
      htmlContent: "",
      textContent: "",
    }
  }

  return (
    <AdminLayout title="Plantillas de Correo">
      <div className="space-y-6">
        {isEditing ? (
          <>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="mr-2">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Volver
                </Button>
                <h1 className="text-2xl font-bold">{currentTemplate ? "Editar plantilla" : "Nueva plantilla"}</h1>
              </div>

              {currentTemplate && (
                <Button variant="outline" size="sm" onClick={handleOpenTestEmailDialog}>
                  <Send className="h-4 w-4 mr-1" />
                  Enviar prueba
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TemplateEditor
                  initialData={currentTemplate || undefined}
                  onSave={handleSaveTemplate}
                  onCancel={handleCancelEdit}
                  isEditing={!!currentTemplate}
                />
              </div>

              <div>
                <VariablesPanel onInsertVariable={handleInsertVariable} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <h1 className="text-2xl font-bold">Plantillas de Correo Electrónico</h1>
              <p className="text-muted-foreground">
                Gestiona las plantillas de correo que se envían a los usuarios en diferentes situaciones.
              </p>
            </div>

            <TemplatesList
              templates={templates}
              onCreateTemplate={handleCreateTemplate}
              onEditTemplate={handleEditTemplate}
              onDuplicateTemplate={handleDuplicateTemplate}
              onDeleteTemplate={handleDeleteTemplate}
              onToggleActive={handleToggleActive}
            />
          </>
        )}
      </div>

      {/* Diálogos */}
      <TestEmailDialog
        isOpen={isTestEmailDialogOpen}
        onClose={() => setIsTestEmailDialogOpen(false)}
        emailPreview={getEmailPreviewData()}
        onSendTest={handleSendTestEmail}
      />

      <DeleteTemplateDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteTemplate}
        templateName={templateToDelete?.name || ""}
      />
    </AdminLayout>
  )
}
