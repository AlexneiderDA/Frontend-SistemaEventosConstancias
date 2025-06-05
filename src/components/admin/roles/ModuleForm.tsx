"use client"

import React, { useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../../ui/dialog"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Button } from "../../ui/button"
import { Textarea } from "../../ui/textarea"
import type { Module } from "../../../types/role"


interface ModuleFormProps {
  isOpen: boolean
  onClose: () => void
  module: Partial<Module> | null
  onSubmit: (module: Partial<Module>) => void
  isEdit: boolean
}

export const ModuleForm: React.FC<ModuleFormProps> = ({ isOpen, onClose, module, onSubmit, isEdit }) => {
  const [formData, setFormData] = React.useState<Partial<Module>>(module || {})
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen && module) {
      setFormData(module)
      setErrors({})
    } else if (isOpen) {
      setFormData({
        name: "",
        key: "",
        description: "",
        permissions: [],
      })
      setErrors({})
    }
  }, [isOpen, module])

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
      newErrors.name = "El nombre del módulo es obligatorio"
    }

    if (!formData.key?.trim()) {
      newErrors.key = "La clave del módulo es obligatoria"
    } else if (!/^[a-z0-9_.-]+$/.test(formData.key)) {
      newErrors.key = "La clave solo puede contener letras minúsculas, números, guiones y puntos"
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
          <DialogTitle>{isEdit ? "Editar Módulo" : "Crear Nuevo Módulo"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifica la información del módulo existente."
              : "Define un nuevo módulo para organizar los permisos del sistema."}
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
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="key" className="text-right">
                Clave
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="key"
                  name="key"
                  value={formData.key || ""}
                  onChange={handleChange}
                  className={errors.key ? "border-red-500" : ""}
                  placeholder="ejemplo_modulo"
                />
                {errors.key && <p className="text-red-500 text-xs">{errors.key}</p>}
                {!errors.key && (
                  <p className="text-xs text-muted-foreground">Identificador único para este módulo (ej: usuarios)</p>
                )}
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
              {isEdit ? "Guardar cambios" : "Crear módulo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
