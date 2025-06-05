"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Textarea } from "../../ui/textarea"
import { Switch } from "../../ui/switch"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import { Card, CardContent } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { AlertCircle, Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip"
import type { SystemSetting } from "../../../types/settings"


interface SettingsFormProps {
  settings: SystemSetting[]
  showAdvanced: boolean
  onSave: (settings: SystemSetting[]) => void
  onReset: () => void
}

export const SettingsForm: React.FC<SettingsFormProps> = ({ settings, showAdvanced, onSave, onReset }) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    // Initialize form values from settings
    const initialValues: Record<string, any> = {}
    settings.forEach((setting) => {
      initialValues[setting.key] = setting.value
    })
    setFormValues(initialValues)
    setIsDirty(false)
    setErrors({})
  }, [settings])

  const handleChange = (key: string, value: any, type: string) => {
    let parsedValue = value

    // Convert value based on type
    if (type === "number") {
      parsedValue = value === "" ? "" : Number(value)
    } else if (type === "boolean") {
      parsedValue = Boolean(value)
    }

    setFormValues((prev) => ({
      ...prev,
      [key]: parsedValue,
    }))
    setIsDirty(true)

    // Clear error if exists
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[key]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    settings.forEach((setting) => {
      const value = formValues[setting.key]
      const validation = setting.validation

      if (!validation) return

      if (validation.required && (value === "" || value === undefined || value === null)) {
        newErrors[setting.key] = validation.message || "Este campo es obligatorio"
      } else if (setting.type === "number" && validation.min !== undefined && value < validation.min) {
        newErrors[setting.key] = validation.message || `El valor mínimo es ${validation.min}`
      } else if (setting.type === "number" && validation.max !== undefined && value > validation.max) {
        newErrors[setting.key] = validation.message || `El valor máximo es ${validation.max}`
      } else if (
        validation.pattern &&
        (setting.type === "string" || setting.type === "email" || setting.type === "url") &&
        !new RegExp(validation.pattern).test(String(value))
      ) {
        newErrors[setting.key] = validation.message || "El formato no es válido"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // Update settings with new values
      const updatedSettings = settings.map((setting) => ({
        ...setting,
        value: formValues[setting.key],
      }))

      onSave(updatedSettings)
      setIsDirty(false)
    }
  }

  const handleReset = () => {
    onReset()
  }

  // Filter settings based on showAdvanced flag
  const visibleSettings = settings.filter((setting) => showAdvanced || !setting.isAdvanced)

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6 space-y-6">
          {visibleSettings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No hay configuraciones disponibles.</div>
          ) : (
            visibleSettings.map((setting) => (
              <div key={setting.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={setting.key} className="font-medium">
                      {setting.label}
                    </Label>
                    {setting.isAdvanced && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Avanzado
                      </Badge>
                    )}
                  </div>
                  {setting.description && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{setting.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>

                <div>
                  {setting.type === "string" || setting.type === "email" || setting.type === "url" ? (
                    <Input
                      id={setting.key}
                      type={setting.type === "email" ? "email" : setting.type === "url" ? "url" : "text"}
                      value={formValues[setting.key] || ""}
                      onChange={(e) => handleChange(setting.key, e.target.value, setting.type)}
                      className={errors[setting.key] ? "border-red-500" : ""}
                    />
                  ) : setting.type === "number" ? (
                    <Input
                      id={setting.key}
                      type="number"
                      value={formValues[setting.key] === undefined ? "" : formValues[setting.key]}
                      onChange={(e) => handleChange(setting.key, e.target.value, setting.type)}
                      className={errors[setting.key] ? "border-red-500" : ""}
                    />
                  ) : setting.type === "boolean" ? (
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={setting.key}
                        checked={Boolean(formValues[setting.key])}
                        onCheckedChange={(checked) => handleChange(setting.key, checked, setting.type)}
                      />
                      <Label htmlFor={setting.key}>
                        {Boolean(formValues[setting.key]) ? "Activado" : "Desactivado"}
                      </Label>
                    </div>
                  ) : setting.type === "select" && setting.options ? (
                    <Select
                      value={String(formValues[setting.key] || "")}
                      onValueChange={(value) => handleChange(setting.key, value, setting.type)}
                    >
                      <SelectTrigger className={errors[setting.key] ? "border-red-500" : ""}>
                        <SelectValue placeholder="Seleccionar opción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {setting.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  ) : setting.type === "textarea" ? (
                    <Textarea
                      id={setting.key}
                      value={formValues[setting.key] || ""}
                      onChange={(e) => handleChange(setting.key, e.target.value, setting.type)}
                      className={errors[setting.key] ? "border-red-500" : ""}
                      rows={4}
                    />
                  ) : setting.type === "color" ? (
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-8 h-8 rounded-md border"
                        style={{ backgroundColor: formValues[setting.key] || "#ffffff" }}
                      />
                      <Input
                        id={setting.key}
                        type="color"
                        value={formValues[setting.key] || "#ffffff"}
                        onChange={(e) => handleChange(setting.key, e.target.value, setting.type)}
                        className="w-16 h-8 p-0"
                      />
                      <Input
                        type="text"
                        value={formValues[setting.key] || ""}
                        onChange={(e) => handleChange(setting.key, e.target.value, setting.type)}
                        className="w-28"
                        placeholder="#RRGGBB"
                      />
                    </div>
                  ) : null}

                  {errors[setting.key] && (
                    <div className="flex items-center mt-1 text-red-500 text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors[setting.key]}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleReset} disabled={!isDirty}>
              Restablecer
            </Button>
            <Button type="submit" className="bg-[#1C8443] hover:bg-[#1C8443]/90" disabled={!isDirty}>
              Guardar cambios
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
