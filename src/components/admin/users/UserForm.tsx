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
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { User } from "@/types/user"

interface UserFormProps {
  isOpen: boolean
  onClose: () => void
  user: Partial<User> | null
  roles: string[]
  departments: string[]
  onSubmit: (user: Partial<User>) => void
}

export const UserForm: React.FC<UserFormProps> = ({ isOpen, onClose, user, roles, departments, onSubmit }) => {
  const [formData, setFormData] = React.useState<Partial<User>>(user || {})
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen && user) {
      setFormData(user)
      setErrors({})
    } else if (isOpen) {
      setFormData({
        name: "",
        email: "",
        role: "",
        department: "",
        status: "active",
      })
      setErrors({})
    }
  }, [isOpen, user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }))
    if (errors.role) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.role
        return newErrors
      })
    }
  }

  const handleDepartmentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, department: value }))
    if (errors.department) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.department
        return newErrors
      })
    }
  }

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, status: checked ? "active" : "inactive" }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      newErrors.name = "El nombre es obligatorio"
    }

    if (!formData.email?.trim()) {
      newErrors.email = "El email es obligatorio"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!formData.role) {
      newErrors.role = "El rol es obligatorio"
    }

    if (!formData.department) {
      newErrors.department = "El departamento es obligatorio"
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
          <DialogTitle>{user?.id ? "Editar Usuario" : "Crear Nuevo Usuario"}</DialogTitle>
          <DialogDescription>
            {user?.id
              ? "Modifica la información del usuario existente."
              : "Completa el formulario para crear un nuevo usuario."}
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
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>
            </div>

            {!user?.id && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Contraseña
                </Label>
                <div className="col-span-3 space-y-1">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password || ""}
                    onChange={handleChange}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Rol
              </Label>
              <div className="col-span-3 space-y-1">
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Roles</SelectLabel>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-red-500 text-xs">{errors.role}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Departamento
              </Label>
              <div className="col-span-3 space-y-1">
                <Select value={formData.department} onValueChange={handleDepartmentChange}>
                  <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seleccionar departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Departamentos</SelectLabel>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.department && <p className="text-red-500 text-xs">{errors.department}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">Estado</div>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch id="user-status" checked={formData.status === "active"} onCheckedChange={handleStatusChange} />
                <Label htmlFor="user-status">
                  {formData.status === "active" ? "Usuario activo" : "Usuario inactivo"}
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#1C8443] hover:bg-[#1C8443]/90">
              {user?.id ? "Guardar cambios" : "Crear usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
