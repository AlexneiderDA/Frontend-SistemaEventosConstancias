"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ImageIcon,
  Square,
  Circle,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Save,
  Eye,
  PanelLeft,
  PanelRight,
  ChevronLeft,
} from "lucide-react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Separator } from "../../ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { Slider } from "../../ui/slider"
import { VariablesPanel } from "./VariablesPanel"
import { TemplatePreview } from "./TemplatePreview"
import { TemplateSettings } from "./TemplateSettings"
import type {
  CertificateTemplate,
  CertificateVariable,
  TemplateEditorState,
  TemplateEditorSettings,
} from "../../../types/certificate"


interface TemplateEditorProps {
  template: CertificateTemplate
  variables: CertificateVariable[]
  onSave: (template: CertificateTemplate) => void
  onBack: () => void
  onPreview: (template: CertificateTemplate) => void
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({ template, variables, onSave, onBack, onPreview }) => {
  const [name, setName] = useState(template.name)
  const [description, setDescription] = useState(template.description)
  const [editorState, setEditorState] = useState<TemplateEditorState>({
    content: template.content || "",
    selectedElement: null,
    zoom: 100,
    history: [template.content || ""],
    historyIndex: 0,
    isDirty: false,
  })

  const [editorSettings, setEditorSettings] = useState<TemplateEditorSettings>({
    showGrid: true,
    snapToGrid: true,
    gridSize: 10,
    showRulers: true,
    pageSize: "A4",
    orientation: "landscape",
    units: "mm",
  })

  const [showVariables, setShowVariables] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [activeTab, setActiveTab] = useState("editor")

  const editorRef = useRef<HTMLDivElement>(null)
  const contentEditableRef = useRef<HTMLDivElement>(null)

  // Inicializar el editor con el contenido de la plantilla
  useEffect(() => {
    if (contentEditableRef.current && template.content) {
      contentEditableRef.current.innerHTML = template.content
    }
  }, [template.content])

  // Función para actualizar el historial cuando se hacen cambios
  const updateHistory = (newContent: string) => {
    if (editorState.historyIndex < editorState.history.length - 1) {
      // Si estamos en medio del historial, truncar el historial futuro
      const newHistory = editorState.history.slice(0, editorState.historyIndex + 1)
      setEditorState({
        ...editorState,
        content: newContent,
        history: [...newHistory, newContent],
        historyIndex: editorState.historyIndex + 1,
        isDirty: true,
      })
    } else {
      // Añadir al final del historial
      setEditorState({
        ...editorState,
        content: newContent,
        history: [...editorState.history, newContent],
        historyIndex: editorState.historyIndex + 1,
        isDirty: true,
      })
    }
  }

  // Funciones para deshacer y rehacer
  const handleUndo = () => {
    if (editorState.historyIndex > 0) {
      const newIndex = editorState.historyIndex - 1
      const newContent = editorState.history[newIndex]

      if (contentEditableRef.current) {
        contentEditableRef.current.innerHTML = newContent
      }

      setEditorState({
        ...editorState,
        content: newContent,
        historyIndex: newIndex,
        isDirty: true,
      })
    }
  }

  const handleRedo = () => {
    if (editorState.historyIndex < editorState.history.length - 1) {
      const newIndex = editorState.historyIndex + 1
      const newContent = editorState.history[newIndex]

      if (contentEditableRef.current) {
        contentEditableRef.current.innerHTML = newContent
      }

      setEditorState({
        ...editorState,
        content: newContent,
        historyIndex: newIndex,
        isDirty: true,
      })
    }
  }

  // Funciones para el zoom
  const handleZoomIn = () => {
    if (editorState.zoom < 200) {
      setEditorState({
        ...editorState,
        zoom: editorState.zoom + 10,
      })
    }
  }

  const handleZoomOut = () => {
    if (editorState.zoom > 50) {
      setEditorState({
        ...editorState,
        zoom: editorState.zoom - 10,
      })
    }
  }

  const handleZoomChange = (value: number[]) => {
    setEditorState({
      ...editorState,
      zoom: value[0],
    })
  }

  // Función para insertar variables en el editor
  const handleInsertVariable = (variable: CertificateVariable) => {
    if (contentEditableRef.current) {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const variableSpan = document.createElement("span")
        variableSpan.className = "variable-tag"
        variableSpan.contentEditable = "false"
        variableSpan.dataset.variable = variable.key
        variableSpan.textContent = `{{${variable.key}}}`
        variableSpan.style.backgroundColor = "#e9f5ff"
        variableSpan.style.color = "#0077cc"
        variableSpan.style.padding = "0 4px"
        variableSpan.style.borderRadius = "4px"
        variableSpan.style.margin = "0 2px"

        range.deleteContents()
        range.insertNode(variableSpan)

        // Mover el cursor después de la variable insertada
        range.setStartAfter(variableSpan)
        range.setEndAfter(variableSpan)
        selection.removeAllRanges()
        selection.addRange(range)

        // Actualizar el historial
        updateHistory(contentEditableRef.current.innerHTML)
      }
    }
  }

  // Funciones para el formato de texto
  const applyFormatting = (command: string, value = "") => {
    document.execCommand(command, false, value)
    if (contentEditableRef.current) {
      updateHistory(contentEditableRef.current.innerHTML)
    }
  }

  // Función para guardar la plantilla
  const handleSave = () => {
    if (contentEditableRef.current) {
      const updatedTemplate: CertificateTemplate = {
        ...template,
        name,
        description,
        content: contentEditableRef.current.innerHTML,
        updatedAt: new Date().toISOString(),
      }

      onSave(updatedTemplate)

      // Resetear el estado de "dirty"
      setEditorState({
        ...editorState,
        isDirty: false,
      })
    }
  }

  // Función para la vista previa
  const handlePreview = () => {
    if (contentEditableRef.current) {
      const previewTemplate: CertificateTemplate = {
        ...template,
        name,
        description,
        content: contentEditableRef.current.innerHTML,
      }

      onPreview(previewTemplate)
    }
  }

  // Función para manejar cambios en la configuración del editor
  const handleSettingsChange = (settings: TemplateEditorSettings) => {
    setEditorSettings(settings)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Barra superior */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="font-medium text-lg border-none focus-visible:ring-0 p-0 h-auto"
              placeholder="Nombre de la plantilla"
            />
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-sm text-muted-foreground border-none focus-visible:ring-0 p-0 h-auto"
              placeholder="Descripción (opcional)"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePreview} className="gap-1">
            <Eye className="h-4 w-4" />
            Vista Previa
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!editorState.isDirty}
            className="gap-1 bg-[#1C8443] hover:bg-[#1C8443]/90"
          >
            <Save className="h-4 w-4" />
            Guardar
          </Button>
        </div>
      </div>

      {/* Pestañas */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b px-4">
          <TabsList>
            <TabsTrigger value="editor" className="data-[state=active]:bg-background">
              Editor
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-background">
              Vista Previa
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="editor" className="flex-1 flex flex-col p-0 mt-0">
          {/* Barra de herramientas */}
          <div className="p-2 border-b flex items-center gap-1 bg-muted/30">
            <Button variant="ghost" size="icon" onClick={handleUndo} disabled={editorState.historyIndex === 0}>
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRedo}
              disabled={editorState.historyIndex >= editorState.history.length - 1}
            >
              <Redo className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <Button variant="ghost" size="icon" onClick={() => applyFormatting("bold")}>
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => applyFormatting("italic")}>
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => applyFormatting("underline")}>
              <Underline className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <Button variant="ghost" size="icon" onClick={() => applyFormatting("justifyLeft")}>
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => applyFormatting("justifyCenter")}>
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => applyFormatting("justifyRight")}>
              <AlignRight className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const url = prompt("Ingrese la URL de la imagen:")
                if (url) {
                  applyFormatting("insertImage", url)
                }
              }}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => applyFormatting("insertUnorderedList")}>
              <Circle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => applyFormatting("insertOrderedList")}>
              <Square className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <div className="flex items-center gap-1 ml-auto">
              <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={editorState.zoom <= 50}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <div className="w-32">
                <Slider value={[editorState.zoom]} min={50} max={200} step={10} onValueChange={handleZoomChange} />
              </div>
              <div className="text-xs w-12 text-center">{editorState.zoom}%</div>
              <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={editorState.zoom >= 200}>
                <ZoomIn className="h-4 w-4" />
              </Button>

              <Separator orientation="vertical" className="mx-1 h-6" />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowVariables(!showVariables)}
                className={showVariables ? "bg-muted" : ""}
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
                className={showSettings ? "bg-muted" : ""}
              >
                <PanelRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Área principal del editor */}
          <div className="flex-1 flex overflow-hidden">
            {/* Panel de variables */}
            {showVariables && (
              <div className="w-64 border-r p-2 overflow-y-auto">
                <VariablesPanel variables={variables} onInsertVariable={handleInsertVariable} />
              </div>
            )}

            {/* Editor de contenido */}
            <div ref={editorRef} className="flex-1 overflow-auto p-8 bg-gray-100 flex justify-center items-start">
              <div
                style={{
                  transform: `scale(${editorState.zoom / 100})`,
                  transformOrigin: "top center",
                  width: editorSettings.orientation === "portrait" ? "210mm" : "297mm",
                  height: editorSettings.orientation === "portrait" ? "297mm" : "210mm",
                  backgroundColor: "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
                  padding: "20mm",
                  margin: "0 auto",
                  position: "relative",
                }}
              >
                {editorSettings.showGrid && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `
                        linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
                      `,
                      backgroundSize: `${editorSettings.gridSize}mm ${editorSettings.gridSize}mm`,
                      pointerEvents: "none",
                    }}
                  />
                )}
                <div
                  ref={contentEditableRef}
                  contentEditable
                  className="w-full h-full outline-none"
                  onInput={(e) => {
                    if (contentEditableRef.current) {
                      updateHistory(contentEditableRef.current.innerHTML)
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: editorState.content }}
                />
              </div>
            </div>

            {/* Panel de configuración */}
            {showSettings && (
              <div className="w-64 border-l p-2 overflow-y-auto">
                <TemplateSettings settings={editorSettings} onChange={handleSettingsChange} />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="preview" className="flex-1 p-0 mt-0">
          {contentEditableRef.current && (
            <TemplatePreview
              template={{
                ...template,
                content: contentEditableRef.current.innerHTML,
              }}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
