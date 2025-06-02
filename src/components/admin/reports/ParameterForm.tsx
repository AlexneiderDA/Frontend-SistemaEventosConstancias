"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Report, ReportParameter } from "@/types/report"

interface ParameterFormProps {
  report: Report
  onSubmit: (parameters: Record<string, any>) => void
  isLoading?: boolean
}

export const ParameterForm: React.FC<ParameterFormProps> = ({ report, onSubmit, isLoading = false }) => {
  const [parameters, setParameters] = useState<Record<string, any>>({})

  // Inicializar con valores por defecto
  useEffect(() => {
    const defaultParams: Record<string, any> = {}

    report.parameters.forEach((param) => {
      if (param.defaultValue !== undefined) {
        defaultParams[param.name] = param.defaultValue
      } else if (param.type === "boolean") {
        defaultParams[param.name] = false
      } else if (param.type === "multiSelect") {
        defaultParams[param.name] = []
      }
    })

    // Manejar rango de fechas por defecto
    if (report.defaultDateRange) {
      const now = new Date()
      let startDate: Date | undefined
      let endDate: Date | undefined

      switch (report.defaultDateRange) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0))
          endDate = new Date(now.setHours(23, 59, 59, 999))
          break
        case "yesterday":
          startDate = new Date(now)
          startDate.setDate(startDate.getDate() - 1)
          startDate.setHours(0, 0, 0, 0)
          endDate = new Date(startDate)
          endDate.setHours(23, 59, 59, 999)
          break
        case "thisWeek":
          startDate = new Date(now)
          startDate.setDate(startDate.getDate() - startDate.getDay())
          startDate.setHours(0, 0, 0, 0)
          endDate = new Date(now)
          break
        case "lastWeek":
          startDate = new Date(now)
          startDate.setDate(startDate.getDate() - startDate.getDay() - 7)
          startDate.setHours(0, 0, 0, 0)
          endDate = new Date(startDate)
          endDate.setDate(endDate.getDate() + 6)
          endDate.setHours(23, 59, 59, 999)
          break
        case "thisMonth":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          endDate = new Date(now)
          break
        case "lastMonth":
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
          endDate = new Date(now.getFullYear(), now.getMonth(), 0)
          break
        case "thisYear":
          startDate = new Date(now.getFullYear(), 0, 1)
          endDate = new Date(now)
          break
      }

      // Buscar parámetros de tipo dateRange
      const dateRangeParam = report.parameters.find((p) => p.type === "dateRange")
      if (dateRangeParam && startDate && endDate) {
        defaultParams[dateRangeParam.name] = { from: startDate, to: endDate }
      }
    }

    setParameters(defaultParams)
  }, [report])

  const handleParameterChange = (name: string, value: any) => {
    setParameters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(parameters)
  }

  const renderParameter = (param: ReportParameter) => {
    switch (param.type) {
      case "string":
        return (
          <div className="space-y-2" key={param.id}>
            <Label htmlFor={param.name}>
              {param.label}
              {param.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={param.name}
              value={parameters[param.name] || ""}
              onChange={(e) => handleParameterChange(param.name, e.target.value)}
              placeholder={param.placeholder}
              required={param.required}
            />
            {param.description && <p className="text-xs text-muted-foreground">{param.description}</p>}
          </div>
        )

      case "number":
        return (
          <div className="space-y-2" key={param.id}>
            <Label htmlFor={param.name}>
              {param.label}
              {param.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={param.name}
              type="number"
              value={parameters[param.name] || ""}
              onChange={(e) => handleParameterChange(param.name, Number(e.target.value))}
              placeholder={param.placeholder}
              required={param.required}
              min={param.validation?.min}
              max={param.validation?.max}
            />
            {param.description && <p className="text-xs text-muted-foreground">{param.description}</p>}
          </div>
        )

      case "boolean":
        return (
          <div className="flex items-center justify-between space-y-0 rounded-md border p-3" key={param.id}>
            <div className="space-y-0.5">
              <Label htmlFor={param.name}>{param.label}</Label>
              {param.description && <p className="text-xs text-muted-foreground">{param.description}</p>}
            </div>
            <Switch
              id={param.name}
              checked={parameters[param.name] || false}
              onCheckedChange={(checked) => handleParameterChange(param.name, checked)}
            />
          </div>
        )

      case "date":
        return (
          <div className="space-y-2" key={param.id}>
            <Label>
              {param.label}
              {param.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !parameters[param.name] && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {parameters[param.name] ? (
                    format(parameters[param.name], "PPP", { locale: es })
                  ) : (
                    <span>{param.placeholder || "Seleccionar fecha"}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={parameters[param.name]}
                  onSelect={(date) => handleParameterChange(param.name, date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {param.description && <p className="text-xs text-muted-foreground">{param.description}</p>}
          </div>
        )

      case "dateRange":
        return (
          <div className="space-y-2" key={param.id}>
            <Label>
              {param.label}
              {param.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !parameters[param.name] && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {parameters[param.name]?.from ? (
                    parameters[param.name]?.to ? (
                      <>
                        {format(parameters[param.name].from, "PPP", { locale: es })} -{" "}
                        {format(parameters[param.name].to, "PPP", { locale: es })}
                      </>
                    ) : (
                      format(parameters[param.name].from, "PPP", { locale: es })
                    )
                  ) : (
                    <span>{param.placeholder || "Seleccionar rango de fechas"}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={parameters[param.name]}
                  onSelect={(range) => handleParameterChange(param.name, range)}
                  initialFocus
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            {param.description && <p className="text-xs text-muted-foreground">{param.description}</p>}
          </div>
        )

      case "select":
        return (
          <div className="space-y-2" key={param.id}>
            <Label htmlFor={param.name}>
              {param.label}
              {param.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={parameters[param.name] || ""}
              onValueChange={(value) => handleParameterChange(param.name, value)}
            >
              <SelectTrigger id={param.name}>
                <SelectValue placeholder={param.placeholder || "Seleccionar opción"} />
              </SelectTrigger>
              <SelectContent>
                {param.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {param.description && <p className="text-xs text-muted-foreground">{param.description}</p>}
          </div>
        )

      case "multiSelect":
        return (
          <div className="space-y-2" key={param.id}>
            <Label>
              {param.label}
              {param.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between">
                  {parameters[param.name]?.length > 0
                    ? `${parameters[param.name].length} seleccionados`
                    : param.placeholder || "Seleccionar opciones"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Buscar..." />
                  <CommandList>
                    <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                    <CommandGroup>
                      {param.options?.map((option) => {
                        const isSelected = (parameters[param.name] || []).includes(option.value)

                        return (
                          <CommandItem
                            key={option.value}
                            onSelect={() => {
                              const currentValues = parameters[param.name] || []
                              const newValues = isSelected
                                ? currentValues.filter((value: string) => value !== option.value)
                                : [...currentValues, option.value]

                              handleParameterChange(param.name, newValues)
                            }}
                          >
                            <div className="flex items-center space-x-2">
                              <Checkbox checked={isSelected} />
                              <span>{option.label}</span>
                            </div>
                            {isSelected && <Check className="ml-auto h-4 w-4" />}
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {param.description && <p className="text-xs text-muted-foreground">{param.description}</p>}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parámetros del Reporte</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {report.parameters.length === 0 ? (
            <p className="text-sm text-muted-foreground">Este reporte no requiere parámetros adicionales.</p>
          ) : (
            report.parameters.map((param) => renderParameter(param))
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" className="bg-[#1C8443] hover:bg-[#1C8443]/90" disabled={isLoading}>
            {isLoading ? "Generando..." : "Generar Reporte"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
