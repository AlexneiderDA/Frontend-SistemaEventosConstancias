"use client"

import type React from "react"
import { FileText, Download } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import { Button } from "../../ui/button"

interface ExportOptionsProps {
  onExport: (format: "csv" | "excel" | "pdf") => void
  disabled?: boolean
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({ onExport, disabled = false }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Opciones de exportación</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onExport("csv")}>
          <FileText className="mr-2 h-4 w-4" />
          Exportar como CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport("excel")}>
          <FileText className="mr-2 h-4 w-4" />
          Exportar como Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport("pdf")}>
          <FileText className="mr-2 h-4 w-4" />
          Exportar como PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
