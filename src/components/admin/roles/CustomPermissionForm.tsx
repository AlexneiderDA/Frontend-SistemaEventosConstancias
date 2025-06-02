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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Permission, Module } from "@/types/role"

interface CustomPermissionFormProps {
  isOpen: boolean
  onClose: () => void
  permission: Partial<Permission> | null
  modules: Module[]
  onSubmit: (permission: Partial<Permission>) => void
  isEdit: boolean
}

export const CustomPermissionForm: React.FC<CustomPermissionFormProps> = ({
  isOpen,
  onClose,
  permission,
  modules,
  onSubmit,
  isEdit,
}) => {
  const [formData, setFormData] = React.useState<Partial<Permission>>(permission || {})
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen && permission) {
      setFormData(permission)
      setErrors({})
    } else if (isOpen) {
      setFormData({
        name: "",
        key: "",
        description: "",
        module: modules.length > 0 ? modules[0].id : "",
      })
      setErrors({})
    }
  }, [isOpen, permission, modules])

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

  const handleModuleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, module: value }))
    if (errors.module) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.module
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      newErrors.name = "El nombre del permiso es obligatorio"
    }

    if (!formData.key?.trim()) {
      newErrors.key = "La clave del permiso es obligatoria"
    } else if (!/^[a-z0-9_.-]+$/.test(formData.key)) {
      newErrors.key = "La clave solo puede contener letras minúsculas, números, guiones y puntos"
    }

    if (!formData.module) {
      newErrors.module = "El módulo es obligatorio"
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
          <DialogTitle>{isEdit ? "Editar Permiso" : "Crear Permiso Personalizado"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifica la información del permiso existente."
              : "Define un nuevo permiso personalizado para el sistema."}
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
                  placeholder="ejemplo.accion_permiso"
                />
                {errors.key && <p className="text-red-500 text-xs">{errors.key}</p>}
                {!errors.key && (
                  <p className="text-xs text-muted-foreground">
                    Identificador único para este permiso (ej: usuarios.crear)
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="module" className="text-right">
                Módulo
              </Label>
              <div className="col-span-3 space-y-1">
                <Select value={formData.module} onValueChange={handleModuleChange}>
                  <SelectTrigger className={errors.module ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seleccionar módulo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Módulos</SelectLabel>
                      {modules.map((module) => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.module && <p className="text-red-500 text-xs">{errors.module}</p>}
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
              {isEdit ? "Guardar cambios" : "Crear permiso"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
