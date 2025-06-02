"use client"

import type React from "react"
import { useState } from "react"
import { Search, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { CertificateVariable } from "@/types/certificate"

interface VariablesPanelProps {
  variables: CertificateVariable[]
  onInsertVariable: (variable: CertificateVariable) => void
}

export const VariablesPanel: React.FC<VariablesPanelProps> = ({ variables, onInsertVariable }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredVariables = variables.filter(
    (variable) =>
      variable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variable.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Agrupar variables por categoría
  const groupedVariables: Record<string, CertificateVariable[]> = {}

  filteredVariables.forEach((variable) => {
    if (!groupedVariables[variable.category]) {
      groupedVariables[variable.category] = []
    }
    groupedVariables[variable.category].push(variable)
  })

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case "participant":
        return "Participante"
      case "event":
        return "Evento"
      case "organization":
        return "Organización"
      case "date":
        return "Fecha y Hora"
      case "other":
        return "Otros"
      default:
        return category
    }
  }

  return (
    <div className="h-full flex flex-col border rounded-md overflow-hidden">
      <div className="p-3 border-b bg-muted/30">
        <h3 className="font-medium">Variables Disponibles</h3>
        <p className="text-xs text-muted-foreground">Arrastra o haz clic para insertar variables en tu plantilla</p>
      </div>

      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar variables..." className="pl-8" value={searchTerm} onChange={handleSearchChange} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-1">
        <TooltipProvider>
          <Accordion type="multiple" defaultValue={Object.keys(groupedVariables)}>
            {Object.entries(groupedVariables).map(([category, vars]) => (
              <AccordionItem key={category} value={category}>
                <AccordionTrigger className="px-2 py-1 text-sm hover:no-underline">
                  {getCategoryLabel(category)} ({vars.length})
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-2">
                  <div className="space-y-1">
                    {vars.map((variable) => (
                      <div
                        key={variable.id}
                        className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-muted/50 cursor-pointer"
                        onClick={() => onInsertVariable(variable)}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", `{{${variable.key}}}`)
                          e.dataTransfer.effectAllowed = "copy"
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{variable.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{`{{${variable.key}}}`}</div>
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Info className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left" align="center">
                            <div className="max-w-xs">
                              <p className="font-medium">{variable.name}</p>
                              <p className="text-xs mt-1">{variable.description}</p>
                              <p className="text-xs mt-1">
                                <span className="font-medium">Ejemplo:</span> {variable.example}
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TooltipProvider>

        {filteredVariables.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">No se encontraron variables</div>
        )}
      </div>
    </div>
  )
}
