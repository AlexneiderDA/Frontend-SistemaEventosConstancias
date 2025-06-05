"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import type { EmailPreviewData, SendTestEmailResponse } from "../../../types/email-template"


interface TestEmailDialogProps {
  isOpen: boolean
  onClose: () => void
  emailPreview: EmailPreviewData
  onSendTest: (email: string) => Promise<SendTestEmailResponse>
}

export const TestEmailDialog: React.FC<TestEmailDialogProps> = ({ isOpen, onClose, emailPreview, onSendTest }) => {
  const [email, setEmail] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [result, setResult] = useState<SendTestEmailResponse | null>(null)

  const handleSendTest = async () => {
    if (!email) return

    setIsSending(true)
    setResult(null)

    try {
      const response = await onSendTest(email)
      setResult(response)
    } catch (error) {
      setResult({
        success: false,
        message: "Error al enviar el correo de prueba",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleClose = () => {
    setEmail("")
    setResult(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar correo de prueba</DialogTitle>
          <DialogDescription>
            Envía una versión de prueba de esta plantilla a cualquier dirección de correo electrónico.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="test-email">Correo electrónico de destino</Label>
            <Input
              id="test-email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSending}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Asunto del correo</Label>
            <div className="border rounded-md p-2 bg-muted/50 text-sm">{emailPreview.subject}</div>
          </div>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{result.success ? "Éxito" : "Error"}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex space-x-2 sm:justify-between">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cerrar
          </Button>
          <Button
            type="button"
            onClick={handleSendTest}
            disabled={!email || isSending}
            className="bg-[#1C8443] hover:bg-[#1C8443]/90"
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar prueba"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
