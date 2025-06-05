"use client"

import type React from "react"
import { useState } from "react"
import { FileText, FileSpreadsheet, FileJson, Download } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog"
import { Button } from "../../ui/button"
import { Label } from "../../ui/label"
import { Input } from "../../ui/input"
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group"
import { Checkbox } from "../../ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import type { ReportExportOptions } from "../../../types/report"


interface ExportReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reportName: string
  onExport: (options: ReportExportOptions) => void
}

export const ExportReportDialog: React.FC<ExportReportDialogProps> = ({ open, onOpenChange, reportName, onExport }) => {
  const [options, setOptions] = useState<ReportExportOptions>({
    format: "pdf",
    includeCharts: true,
    orientation: "portrait",
    pageSize: "a4",
    fileName: `${reportName.replace(/\s+/g, "_").toLowerCase()}_${new Date().toISOString().split("T")[0]}`,
  })

  const handleChange = <K extends keyof ReportExportOptions>(key: K, value: ReportExportOptions[K]) => {
    setOptions((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleExport = () => {
    onExport(options)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exportar Reporte</DialogTitle>
          <DialogDescription>Selecciona el formato y las opciones para exportar el reporte.</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Formato de exportación</Label>
            <RadioGroup
              value={options.format}
              onValueChange={(value) => handleChange("format", value as ReportExportOptions["format"])}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex items-center cursor-pointer">
                  <FileText className="mr-2 h-4 w-4" />
                  PDF
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
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center cursor-pointer">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  CSV
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="flex items-center cursor-pointer">
                  <FileJson className="mr-2 h-4 w-4" />
                  JSON
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-name">Nombre del archivo</Label>
            <Input id="file-name" value={options.fileName} onChange={(e) => handleChange("fileName", e.target.value)} />
          </div>

          {options.format === "pdf" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="orientation">Orientación</Label>
                <Select
                  value={options.orientation}
                  onValueChange={(value) => handleChange("orientation", value as "portrait" | "landscape")}
                >
                  <SelectTrigger id="orientation">
                    <SelectValue placeholder="Seleccionar orientación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Vertical</SelectItem>
                    <SelectItem value="landscape">Horizontal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="page-size">Tamaño de página</Label>
                <Select
                  value={options.pageSize}
                  onValueChange={(value) => handleChange("pageSize", value as "a4" | "letter" | "legal")}
                >
                  <SelectTrigger id="page-size">
                    <SelectValue placeholder="Seleccionar tamaño" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a4">A4</SelectItem>
                    <SelectItem value="letter">Carta</SelectItem>
                    <SelectItem value="legal">Oficio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-charts"
              checked={options.includeCharts}
              onCheckedChange={(checked) => handleChange("includeCharts", !!checked)}
            />
            <Label htmlFor="include-charts" className="cursor-pointer">
              Incluir gráficos
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
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
