"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../ui/tabs"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Textarea } from "../../ui/textarea"
import { Switch } from "../../ui/switch"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import { Card, CardContent } from "../../ui/card"
import type { EmailTemplateFormData, EmailTemplateType } from "../../../types/email-template"


interface TemplateEditorProps {
  initialData?: EmailTemplateFormData
  onSave: (data: EmailTemplateFormData) => void
  onCancel: () => void
  isEditing: boolean
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({ initialData, onSave, onCancel, isEditing }) => {
  const defaultData: EmailTemplateFormData = {
    name: "",
    type: "custom",
    subject: "",
    htmlContent:
      '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">\n  <h1 style="color: #1C8443;">Título del correo</h1>\n  <p>Hola {{user.name}},</p>\n  <p>Este es un ejemplo de contenido para tu correo electrónico.</p>\n  <p>Puedes personalizar este contenido según tus necesidades.</p>\n  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">\n    <p>Saludos,<br>El equipo de {{system.siteName}}</p>\n  </div>\n</div>',
    textContent:
      "Hola {{user.name}},\n\nEste es un ejemplo de contenido para tu correo electrónico.\nPuedes personalizar este contenido según tus necesidades.\n\nSaludos,\nEl equipo de {{system.siteName}}",
    isActive: true,
  }

  const [formData, setFormData] = useState<EmailTemplateFormData>(initialData || defaultData)
  const [activeTab, setActiveTab] = useState<string>("html")
  const [previewMode, setPreviewMode] = useState<boolean>(false)

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleChange = (field: keyof EmailTemplateFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const renderPreview = () => {
    if (activeTab === "html") {
      return (
        <div className="border rounded-md p-4 bg-white">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.htmlContent }} />
        </div>
      )
    } else {
      return (
        <div className="border rounded-md p-4 bg-white">
          <pre className="whitespace-pre-wrap font-mono text-sm">{formData.textContent}</pre>
        </div>
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la plantilla</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Ej: Bienvenida a nuevos usuarios"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo de plantilla</Label>
            <Select value={formData.type} onValueChange={(value) => handleChange("type", value as EmailTemplateType)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Asunto del correo</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              placeholder="Ej: Bienvenido a nuestro sistema"
              required
            />
          </div>

          <div className="flex items-center space-x-2 pt-4">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleChange("isActive", checked)}
            />
            <Label htmlFor="isActive">Plantilla activa</Label>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Vista previa</h3>
              <Switch id="previewMode" checked={previewMode} onCheckedChange={setPreviewMode} />
              <Label htmlFor="previewMode">Mostrar vista previa</Label>
            </div>

            {previewMode ? (
              renderPreview()
            ) : (
              <div className="text-center text-muted-foreground p-8">
                <p>Activa la vista previa para ver cómo se verá tu correo</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="html">Editor HTML</TabsTrigger>
            <TabsTrigger value="text">Texto plano</TabsTrigger>
          </TabsList>
          <TabsContent value="html" className="space-y-2">
            <Label htmlFor="htmlContent">Contenido HTML</Label>
            <Textarea
              id="htmlContent"
              value={formData.htmlContent}
              onChange={(e) => handleChange("htmlContent", e.target.value)}
              className="min-h-[300px] font-mono"
              placeholder="<p>Contenido HTML del correo</p>"
              required
            />
          </TabsContent>
          <TabsContent value="text" className="space-y-2">
            <Label htmlFor="textContent">Contenido de texto plano</Label>
            <Textarea
              id="textContent"
              value={formData.textContent}
              onChange={(e) => handleChange("textContent", e.target.value)}
              className="min-h-[300px] font-mono"
              placeholder="Contenido de texto plano del correo"
              required
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-[#1C8443] hover:bg-[#1C8443]/90">
          {isEditing ? "Actualizar plantilla" : "Crear plantilla"}
        </Button>
      </div>
    </form>
  )
}
