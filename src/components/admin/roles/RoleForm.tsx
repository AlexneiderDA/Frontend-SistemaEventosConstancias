"use client"

import React, { useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Role } from "@/types/role"

interface RoleFormProps {
  isOpen: boolean
  onClose: () => void
  role: Partial<Role> | null
  onSubmit: (role: Partial<Role>) => void
  isEdit: boolean
}

export const RoleForm: React.FC<RoleFormProps> = ({ isOpen, onClose, role, onSubmit, isEdit }) => {
  const [formData, setFormData] = React.useState<Partial<Role>>(role || {})
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen && role) {
      setFormData(role)
      setErrors({})
    } else if (isOpen) {
      setFormData({
        name: "",
        description: "",
        isSystem: false,
      })
      setErrors({})
    }
  }, [isOpen, role])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error cuando el usuario escribe
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      newErrors.name = "El nombre del rol es obligatorio"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Rol" : "Crear Nuevo Rol"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifica la información del rol existente."
              : "Define un nuevo rol para asignar a los usuarios del sistema."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className={errors.name ? "border-red-500" : ""}
                  disabled={formData.isSystem}
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Descripción
              </Label>
              <div className="col-span-3 space-y-1">
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  rows={3}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#1C8443] hover:bg-[#1C8443]/90">
              {isEdit ? "Guardar cambios" : "Crear rol"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
