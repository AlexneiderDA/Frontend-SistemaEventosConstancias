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
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { EventType, EventStatus, EventTag } from "@/types/event"

interface BulkEditDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedCount: number
  eventTypes: { value: string; label: string }[]
  eventStatuses: { value: string; label: string }[]
  tags: EventTag[]
  onSubmit: (changes: BulkEditChanges) => void
}

export interface BulkEditChanges {
  type?: EventType
  status?: EventStatus
  isPublished?: boolean
  addTags?: string[]
  removeTags?: string[]
}

export const BulkEditDialog: React.FC<BulkEditDialogProps> = ({
  isOpen,
  onClose,
  selectedCount,
  eventTypes,
  eventStatuses,
  tags,
  onSubmit,
}) => {
  const [changes, setChanges] = useState<BulkEditChanges>({})
  const [fieldsToUpdate, setFieldsToUpdate] = useState({
    type: false,
    status: false,
    isPublished: false,
    tags: false,
  })
  const [tagsToAdd, setTagsToAdd] = useState<string[]>([])
  const [tagsToRemove, setTagsToRemove] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) {
      // Reset form state
      setChanges({})
      setFieldsToUpdate({
        type: false,
        status: false,
        isPublished: false,
        tags: false,
      })
      setTagsToAdd([])
      setTagsToRemove([])
    }
  }, [isOpen])

  const handleFieldToggle = (field: keyof typeof fieldsToUpdate) => {
    setFieldsToUpdate((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))

    // Clear the field value if toggled off
    if (fieldsToUpdate[field]) {
      setChanges((prev) => {
        const newChanges = { ...prev }
        delete newChanges[field as keyof BulkEditChanges]
        return newChanges
      })
    }
  }

  const handleTypeChange = (value: string) => {
    setChanges((prev) => ({ ...prev, type: value as EventType }))
  }

  const handleStatusChange = (value: string) => {
    setChanges((prev) => ({ ...prev, status: value as EventStatus }))
  }

  const handlePublishedChange = (checked: boolean) => {
    setChanges((prev) => ({ ...prev, isPublished: checked }))
  }

  const handleTagToggle = (tagId: string, isAdd: boolean) => {
    if (isAdd) {
      setTagsToAdd((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
      // Remove from tagsToRemove if it's there
      setTagsToRemove((prev) => prev.filter((id) => id !== tagId))
    } else {
      setTagsToRemove((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
      // Remove from tagsToAdd if it's there
      setTagsToAdd((prev) => prev.filter((id) => id !== tagId))
    }
  }

  const handleSubmit = () => {
    const finalChanges: BulkEditChanges = {}

    if (fieldsToUpdate.type && changes.type) {
      finalChanges.type = changes.type
    }

    if (fieldsToUpdate.status && changes.status) {
      finalChanges.status = changes.status
    }

    if (fieldsToUpdate.isPublished && changes.isPublished !== undefined) {
      finalChanges.isPublished = changes.isPublished
    }

    if (fieldsToUpdate.tags) {
      if (tagsToAdd.length > 0) {
        finalChanges.addTags = tagsToAdd
      }
      if (tagsToRemove.length > 0) {
        finalChanges.removeTags = tagsToRemove
      }
    }

    onSubmit(finalChanges)
  }

  const hasChanges =
    Object.values(fieldsToUpdate).some(Boolean) &&
    ((fieldsToUpdate.type && changes.type) ||
      (fieldsToUpdate.status && changes.status) ||
      (fieldsToUpdate.isPublished && changes.isPublished !== undefined) ||
      (fieldsToUpdate.tags && (tagsToAdd.length > 0 || tagsToRemove.length > 0)))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edición Masiva de Eventos</DialogTitle>
          <DialogDescription>
            Editar {selectedCount} evento{selectedCount !== 1 ? "s" : ""} seleccionado{selectedCount !== 1 ? "s" : ""}.
            Selecciona los campos que deseas modificar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="update-type"
              checked={fieldsToUpdate.type}
              onCheckedChange={() => handleFieldToggle("type")}
            />
            <Label htmlFor="update-type">Actualizar tipo de evento</Label>
          </div>
          {fieldsToUpdate.type && (
            <div className="pl-6">
              <Select value={changes.type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tipo de evento</SelectLabel>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="update-status"
              checked={fieldsToUpdate.status}
              onCheckedChange={() => handleFieldToggle("status")}
            />
            <Label htmlFor="update-status">Actualizar estado</Label>
          </div>
          {fieldsToUpdate.status && (
            <div className="pl-6">
              <Select value={changes.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Estado del evento</SelectLabel>
                    {eventStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="update-published"
              checked={fieldsToUpdate.isPublished}
              onCheckedChange={() => handleFieldToggle("isPublished")}
            />
            <Label htmlFor="update-published">Actualizar estado de publicación</Label>
          </div>
          {fieldsToUpdate.isPublished && (
            <div className="pl-6 flex items-center space-x-2">
              <Switch id="published-state" checked={changes.isPublished} onCheckedChange={handlePublishedChange} />
              <Label htmlFor="published-state">
                {changes.isPublished ? "Publicar eventos" : "Despublicar eventos"}
              </Label>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="update-tags"
              checked={fieldsToUpdate.tags}
              onCheckedChange={() => handleFieldToggle("tags")}
            />
            <Label htmlFor="update-tags">Actualizar etiquetas</Label>
          </div>
          {fieldsToUpdate.tags && (
            <div className="pl-6 space-y-3">
              <div>
                <Label className="text-sm font-medium mb-2 block">Añadir etiquetas</Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <div
                      key={`add-${tag.id}`}
                      className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                        tagsToAdd.includes(tag.id) ? "bg-opacity-100 text-white" : "bg-opacity-20 text-gray-700"
                      }`}
                      style={{
                        backgroundColor: tagsToAdd.includes(tag.id) ? tag.color : `${tag.color}33`,
                      }}
                      onClick={() => handleTagToggle(tag.id, true)}
                    >
                      {tag.name}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Quitar etiquetas</Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <div
                      key={`remove-${tag.id}`}
                      className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                        tagsToRemove.includes(tag.id) ? "bg-opacity-100 text-white" : "bg-opacity-20 text-gray-700"
                      }`}
                      style={{
                        backgroundColor: tagsToRemove.includes(tag.id) ? "#ef4444" : "#ef444433",
                      }}
                      onClick={() => handleTagToggle(tag.id, false)}
                    >
                      {tag.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            className="bg-[#1C8443] hover:bg-[#1C8443]/90"
            onClick={handleSubmit}
            disabled={!hasChanges}
          >
            Aplicar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
