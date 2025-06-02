"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"

interface DeleteTemplateDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  templateName: string
}

export const DeleteTemplateDialog: React.FC<DeleteTemplateDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  templateName,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Eliminar plantilla
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar la plantilla <strong>"{templateName}"</strong>? Esta acción no se puede
            deshacer.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-between">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            Eliminar plantilla
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
