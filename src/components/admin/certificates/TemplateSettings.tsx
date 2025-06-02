"use client"

import type React from "react"
import { Settings, Grid, Ruler, FileText } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { TemplateEditorSettings } from "@/types/certificate"

interface TemplateSettingsProps {
  settings: TemplateEditorSettings
  onChange: (settings: TemplateEditorSettings) => void
}

export const TemplateSettings: React.FC<TemplateSettingsProps> = ({ settings, onChange }) => {
  const handleShowGridChange = (checked: boolean) => {
    onChange({
      ...settings,
      showGrid: checked,
    })
  }

  const handleSnapToGridChange = (checked: boolean) => {
    onChange({
      ...settings,
      snapToGrid: checked,
    })
  }

  const handleGridSizeChange = (value: number[]) => {
    onChange({
      ...settings,
      gridSize: value[0],
    })
  }

  const handleShowRulersChange = (checked: boolean) => {
    onChange({
      ...settings,
      showRulers: checked,
    })
  }

  const handlePageSizeChange = (value: "A4" | "Letter" | "Custom") => {
    onChange({
      ...settings,
      pageSize: value,
    })
  }

  const handleOrientationChange = (value: "portrait" | "landscape") => {
    onChange({
      ...settings,
      orientation: value,
    })
  }

  const handleUnitsChange = (value: "mm" | "cm" | "in") => {
    onChange({
      ...settings,
      units: value,
    })
  }

  const handleCustomWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    if (!isNaN(value)) {
      onChange({
        ...settings,
        customWidth: value,
      })
    }
  }

  const handleCustomHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    if (!isNaN(value)) {
      onChange({
        ...settings,
        customHeight: value,
      })
    }
  }

  return (
    <div className="h-full flex flex-col border rounded-md overflow-hidden">
      <div className="p-3 border-b bg-muted/30">
        <h3 className="font-medium flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Configuración
        </h3>
        <p className="text-xs text-muted-foreground">Personaliza las opciones del editor</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <Accordion type="multiple" defaultValue={["grid", "page"]}>
          <AccordionItem value="grid">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <Grid className="h-4 w-4" />
                <span>Cuadrícula</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-grid">Mostrar cuadrícula</Label>
                  <Switch id="show-grid" checked={settings.showGrid} onCheckedChange={handleShowGridChange} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="snap-grid">Ajustar a cuadrícula</Label>
                  <Switch id="snap-grid" checked={settings.snapToGrid} onCheckedChange={handleSnapToGridChange} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="grid-size">Tamaño de cuadrícula</Label>
                    <span className="text-sm">
                      {settings.gridSize} {settings.units}
                    </span>
                  </div>
                  <Slider
                    id="grid-size"
                    value={[settings.gridSize]}
                    min={5}
                    max={20}
                    step={1}
                    onValueChange={handleGridSizeChange}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rulers">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                <span>Reglas</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-rulers">Mostrar reglas</Label>
                  <Switch id="show-rulers" checked={settings.showRulers} onCheckedChange={handleShowRulersChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="units">Unidades</Label>
                  <Select value={settings.units} onValueChange={handleUnitsChange as (value: string) => void}>
                    <SelectTrigger id="units">
                      <SelectValue placeholder="Seleccionar unidades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm">Milímetros (mm)</SelectItem>
                      <SelectItem value="cm">Centímetros (cm)</SelectItem>
                      <SelectItem value="in">Pulgadas (in)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="page">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Página</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="page-size">Tamaño de página</Label>
                  <Select value={settings.pageSize} onValueChange={handlePageSizeChange as (value: string) => void}>
                    <SelectTrigger id="page-size">
                      <SelectValue placeholder="Seleccionar tamaño" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A4">A4 (210 × 297 mm)</SelectItem>
                      <SelectItem value="Letter">Carta (8.5 × 11 in)</SelectItem>
                      <SelectItem value="Custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {settings.pageSize === "Custom" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="custom-width">Ancho</Label>
                      <div className="flex items-center">
                        <Input
                          id="custom-width"
                          type="number"
                          value={settings.customWidth || ""}
                          onChange={handleCustomWidthChange}
                          className="w-full"
                        />
                        <span className="ml-2 text-sm">{settings.units}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="custom-height">Alto</Label>
                      <div className="flex items-center">
                        <Input
                          id="custom-height"
                          type="number"
                          value={settings.customHeight || ""}
                          onChange={handleCustomHeightChange}
                          className="w-full"
                        />
                        <span className="ml-2 text-sm">{settings.units}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="orientation">Orientación</Label>
                  <Select
                    value={settings.orientation}
                    onValueChange={handleOrientationChange as (value: string) => void}
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
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
