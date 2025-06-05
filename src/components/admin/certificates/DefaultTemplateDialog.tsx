"use client"

import type React from "react"
import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "../../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import type { CertificateTemplate } from "../../../types/certificate"


interface DefaultTemplateDialogProps {
  isOpen: boolean
  onClose: () => void
  template: CertificateTemplate
  eventTypes: { value: string; label: string }[]
  onConfirm: (template: CertificateTemplate, forEventTypes: string[]) => void
}

export const DefaultTemplateDialog: React.FC<DefaultTemplateDialogProps> = ({
  isOpen,
  onClose,
  template,
  eventTypes,
  onConfirm,
}) => {
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([])
  const [applyToAll, setApplyToAll] = useState(false)

  const handleEventTypeChange = (value: string) => {
    if (value === "all") {
      setApplyToAll(true)
      setSelectedEventTypes([])
    } else {
      setApplyToAll(false)
      if (!selectedEventTypes.includes(value)) {
        setSelectedEventTypes([...selectedEventTypes, value])
      }
    }
  }

  const handleRemoveEventType = (typeToRemove: string) => {
    setSelectedEventTypes(selectedEventTypes.filter((type) => type !== typeToRemove))
  }

  const handleConfirm = () => {
    const eventTypesToApply = applyToAll ? eventTypes.map((type) => type.value) : selectedEventTypes

    onConfirm(template, eventTypesToApply)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Establecer como plantilla predeterminada</DialogTitle>
          <DialogDescription>
            Esta plantilla se utilizará automáticamente para los tipos de eventos seleccionados.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Selecciona los tipos de eventos para esta plantilla predeterminada:
            </label>

            <Select onValueChange={handleEventTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo de evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos de eventos</SelectItem>
                {eventTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value} disabled={selectedEventTypes.includes(type.value)}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {applyToAll ? (
            <div className="flex items-center p-2 bg-amber-50 border border-amber-200 rounded-md">
              <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                Esta plantilla se establecerá como predeterminada para todos los tipos de eventos.
              </p>
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium">Tipos de eventos seleccionados:</label>

              {selectedEventTypes.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedEventTypes.map((typeId) => {
                    const typeLabel = eventTypes.find((t) => t.value === typeId)?.label || typeId
                    return (
                      <div key={typeId} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm">
                        <span>{typeLabel}</span>
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => handleRemoveEventType(typeId)}
                        >
                          ×
                        </button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">No has seleccionado ningún tipo de evento.</p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!applyToAll && selectedEventTypes.length === 0}
            className="bg-[#1C8443] hover:bg-[#1C8443]/90"
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
