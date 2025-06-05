"use client"

import type React from "react"
import { useState } from "react"
import { Download, FileText, FileSpreadsheet, FileJson, Calendar } from "lucide-react"
import { Button } from "../../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog"
import { Label } from "../../ui/label"
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group"
import { Checkbox } from "../../ui/checkbox"
import type { SystemLogFilter } from "../../../types/system-log"


interface ExportOptionsProps {
  onExport: (format: string, includeDetails: boolean, dateRange: { from?: Date; to?: Date }) => void
  currentFilters: SystemLogFilter
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({ onExport, currentFilters }) => {
  const [open, setOpen] = useState(false)
  const [format, setFormat] = useState("csv")
  const [includeDetails, setIncludeDetails] = useState(true)
  const [useCurrentFilters, setUseCurrentFilters] = useState(true)
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: currentFilters.startDate ? new Date(currentFilters.startDate) : undefined,
    to: currentFilters.endDate ? new Date(currentFilters.endDate) : undefined,
  })

  const handleExport = () => {
    onExport(format, includeDetails, useCurrentFilters ? dateRange : {})
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exportar registros</DialogTitle>
          <DialogDescription>
            Selecciona el formato y las opciones para exportar los registros de la bitácora.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Formato de exportación</Label>
            <RadioGroup value={format} onValueChange={setFormat} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center cursor-pointer">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  CSV
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel" className="flex items-center cursor-pointer">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Excel
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="flex items-center cursor-pointer">
                  <FileJson className="mr-2 h-4 w-4" />
                  JSON
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex items-center cursor-pointer">
                  <FileText className="mr-2 h-4 w-4" />
                  PDF
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Opciones</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-details"
                checked={includeDetails}
                onCheckedChange={(checked) => setIncludeDetails(checked as boolean)}
              />
              <Label htmlFor="include-details" className="cursor-pointer">
                Incluir detalles completos
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="use-filters"
                checked={useCurrentFilters}
                onCheckedChange={(checked) => setUseCurrentFilters(checked as boolean)}
              />
              <Label htmlFor="use-filters" className="cursor-pointer">
                Usar filtros actuales
              </Label>
            </div>
          </div>

          {useCurrentFilters && (
            <div className="space-y-2">
              <Label className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Rango de fechas aplicado
              </Label>
              <div className="text-sm text-muted-foreground">
                {currentFilters.startDate
                  ? new Date(currentFilters.startDate).toLocaleDateString()
                  : "Inicio no especificado"}{" "}
                -{" "}
                {currentFilters.endDate ? new Date(currentFilters.endDate).toLocaleDateString() : "Fin no especificado"}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleExport} className="bg-[#1C8443] hover:bg-[#1C8443]/90">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
