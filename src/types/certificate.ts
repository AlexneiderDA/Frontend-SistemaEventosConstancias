export interface CertificateTemplate {
  id: string
  name: string
  description: string
  thumbnail: string
  content: string
  isDefault: boolean
  eventTypes: string[]
  createdAt: string
  updatedAt: string
  createdBy: string
  lastModifiedBy: string
}

export interface CertificateVariable {
  id: string
  name: string
  key: string
  description: string
  category: "participant" | "event" | "organization" | "date" | "other"
  example: string
}

export interface TemplateFilter {
  search: string
  eventType: string
  sortBy: "name" | "createdAt" | "updatedAt"
  sortDirection: "asc" | "desc"
  showOnlyDefault: boolean
}

export interface TemplateEditorState {
  content: string
  selectedElement: string | null
  zoom: number
  history: string[]
  historyIndex: number
  isDirty: boolean
}

export interface TemplateEditorSettings {
  showGrid: boolean
  snapToGrid: boolean
  gridSize: number
  showRulers: boolean
  pageSize: "A4" | "Letter" | "Custom"
  orientation: "portrait" | "landscape"
  units: "mm" | "cm" | "in"
  customWidth?: number
  customHeight?: number
}
