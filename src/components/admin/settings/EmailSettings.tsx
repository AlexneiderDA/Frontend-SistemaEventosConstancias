"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Send, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { EmailConfig } from "@/types/settings"

interface EmailSettingsProps {
  config: EmailConfig
  onSave: (config: EmailConfig) => void
  onTestEmail: (email: string) => Promise<{ success: boolean; message: string }>
}

export const EmailSettings: React.FC<EmailSettingsProps> = ({ config, onSave, onTestEmail }) => {
  const [formValues, setFormValues] = useState<EmailConfig>(config)
  const [isDirty, setIsDirty] = useState(false)
  const [testEmail, setTestEmail] = useState("")
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string } | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  useEffect(() => {
    setFormValues(config)
    setIsDirty(false)
  }, [config])

  const handleChange = <K extends keyof EmailConfig>(key: K, value: EmailConfig[K]) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }))
    setIsDirty(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formValues)
    setIsDirty(false)
  }

  const handleTestEmail = async () => {
    if (!testEmail) return

    setIsTesting(true)
    setTestResult(null)

    try {
      const result = await onTestEmail(testEmail)
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        message: "Error al enviar el correo de prueba",
      })
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Correo Electrónico</CardTitle>
          <CardDescription>Configura cómo el sistema enviará correos electrónicos a los usuarios.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-provider">Proveedor de correo</Label>
                    <Select
                      value={formValues.provider}
                      onValueChange={(value) => handleChange("provider", value as EmailConfig["provider"])}
                    >
                      <SelectTrigger id="email-provider">
                        <SelectValue placeholder="Seleccionar proveedor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="smtp">SMTP</SelectItem>
                          <SelectItem value="sendgrid">SendGrid</SelectItem>
                          <SelectItem value="mailgun">Mailgun</SelectItem>
                          <SelectItem value="ses">Amazon SES</SelectItem>
                          <SelectItem value="none">Ninguno (desactivar correos)</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="from-email">Correo remitente</Label>
                    <Input
                      id="from-email"
                      type="email"
                      value={formValues.fromEmail}
                      onChange={(e) => handleChange("fromEmail", e.target.value)}
                      placeholder="noreply@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="from-name">Nombre remitente</Label>
                    <Input
                      id="from-name"
                      value={formValues.fromName}
                      onChange={(e) => handleChange("fromName", e.target.value)}
                      placeholder="Sistema de Eventos"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {formValues.provider === "smtp" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="smtp-host">Servidor SMTP</Label>
                        <Input
                          id="smtp-host"
                          value={formValues.smtpHost || ""}
                          onChange={(e) => handleChange("smtpHost", e.target.value)}
                          placeholder="smtp.example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="smtp-port">Puerto SMTP</Label>
                        <Input
                          id="smtp-port"
                          type="number"
                          value={formValues.smtpPort || ""}
                          onChange={(e) => handleChange("smtpPort", Number(e.target.value))}
                          placeholder="587"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="smtp-user">Usuario SMTP</Label>
                          <Input
                            id="smtp-user"
                            value={formValues.smtpUser || ""}
                            onChange={(e) => handleChange("smtpUser", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="smtp-password">Contraseña SMTP</Label>
                          <Input
                            id="smtp-password"
                            type="password"
                            value={formValues.smtpPassword || ""}
                            onChange={(e) => handleChange("smtpPassword", e.target.value)}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {(formValues.provider === "sendgrid" || formValues.provider === "mailgun") && (
                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <Input
                        id="api-key"
                        type="password"
                        value={formValues.apiKey || ""}
                        onChange={(e) => handleChange("apiKey", e.target.value)}
                      />
                    </div>
                  )}

                  {formValues.provider === "mailgun" && (
                    <div className="space-y-2">
                      <Label htmlFor="domain">Dominio</Label>
                      <Input
                        id="domain"
                        value={formValues.domain || ""}
                        onChange={(e) => handleChange("domain", e.target.value)}
                        placeholder="mail.example.com"
                      />
                    </div>
                  )}

                  {formValues.provider === "ses" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="api-key">API Key</Label>
                        <Input
                          id="api-key"
                          type="password"
                          value={formValues.apiKey || ""}
                          onChange={(e) => handleChange("apiKey", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="region">Región AWS</Label>
                        <Select
                          value={formValues.region || ""}
                          onValueChange={(value) => handleChange("region", value)}
                        >
                          <SelectTrigger id="region">
                            <SelectValue placeholder="Seleccionar región" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                              <SelectItem value="us-east-2">US East (Ohio)</SelectItem>
                              <SelectItem value="us-west-1">US West (N. California)</SelectItem>
                              <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                              <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                              <SelectItem value="eu-central-1">EU (Frankfurt)</SelectItem>
                              <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                              <SelectItem value="ap-southeast-2">Asia Pacific (Sydney)</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="space-y-4">
                  <Label>Enviar correo de prueba</Label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <Input
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        disabled={isTesting || formValues.provider === "none"}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleTestEmail}
                      disabled={!testEmail || isTesting || formValues.provider === "none"}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {isTesting ? "Enviando..." : "Enviar prueba"}
                    </Button>
                  </div>

                  {testResult && (
                    <Alert variant={testResult.success ? "default" : "destructive"}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>{testResult.success ? "Éxito" : "Error"}</AlertTitle>
                      <AlertDescription>{testResult.message}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-[#1C8443] hover:bg-[#1C8443]/90" disabled={!isDirty}>
                Guardar configuración
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
