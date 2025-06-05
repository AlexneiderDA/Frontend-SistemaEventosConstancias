"use client"

import type React from "react"
import { AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog"
import type { CertificateTemplate } from "../../../types/certificate"

interface DeleteTemplateDialogProps {
  isOpen: boolean
  onClose: () => void
  template: CertificateTemplate | null
  onConfirm: () => void
}

export const DeleteTemplateDialog: React.FC<DeleteTemplateDialogProps> = ({ isOpen, onClose, template, onConfirm }) => {
  if (!template) return null

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente la plantilla
            <span className="font-medium"> "{template.name}"</span> y no estará disponible para generar constancias.
            {template.isDefault && (
              <div className="mt-2 flex items-center p-2 bg-amber-50 border border-amber-200 rounded-md">
                <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  Esta es una plantilla predeterminada. Al eliminarla, los tipos de eventos asociados no tendrán una
                  plantilla predeterminada.
                </p>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
