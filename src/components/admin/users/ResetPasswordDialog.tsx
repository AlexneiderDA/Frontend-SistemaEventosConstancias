"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { Checkbox } from "../../ui/checkbox"
import type { User } from "../../../types/user"


interface ResetPasswordDialogProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onSubmit: (userId: string, newPassword: string, sendEmail: boolean) => void
}

export const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({ isOpen, onClose, user, onSubmit }) => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [sendEmail, setSendEmail] = useState(true)
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({})

  useEffect(() => {
    if (isOpen) {
      setPassword("")
      setConfirmPassword("")
      setSendEmail(true)
      setErrors({})
    }
  }, [isOpen])

  const validateForm = (): boolean => {
    const newErrors: { password?: string; confirm?: string } = {}

    if (!password) {
      newErrors.password = "La contraseña es obligatoria"
    } else if (password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres"
    }

    if (password !== confirmPassword) {
      newErrors.confirm = "Las contraseñas no coinciden"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm() && user) {
      onSubmit(user.id, password, sendEmail)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Restablecer Contraseña</DialogTitle>
          <DialogDescription>{user && `Establece una nueva contraseña para ${user.name}`}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-password" className="text-right">
                Nueva contraseña
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) {
                      setErrors({ ...errors, password: undefined })
                    }
                  }}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirm-password" className="text-right">
                Confirmar contraseña
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (errors.confirm) {
                      setErrors({ ...errors, confirm: undefined })
                    }
                  }}
                  className={errors.confirm ? "border-red-500" : ""}
                />
                {errors.confirm && <p className="text-red-500 text-xs">{errors.confirm}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="send-email"
                    checked={sendEmail}
                    onCheckedChange={(checked) => setSendEmail(!!checked)}
                  />
                  <Label htmlFor="send-email">Enviar email de notificación al usuario</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#1C8443] hover:bg-[#1C8443]/90" disabled={!user}>
              Restablecer contraseña
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
