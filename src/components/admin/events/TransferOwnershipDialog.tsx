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
} from "../../ui/dialog"
import { Button } from "../../ui/button"
import { Label } from "../../ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { Search } from "lucide-react"
import { Input } from "../../ui/input"
import { ScrollArea } from "../../ui/scroll-area"
import type { Event, Organizer } from "../../../types/event"


interface TransferOwnershipDialogProps {
  isOpen: boolean
  onClose: () => void
  event: Event | null
  organizers: Organizer[]
  onSubmit: (eventId: string, newOrganizerId: string) => void
}

export const TransferOwnershipDialog: React.FC<TransferOwnershipDialogProps> = ({
  isOpen,
  onClose,
  event,
  organizers,
  onSubmit,
}) => {
  const [selectedOrganizerId, setSelectedOrganizerId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (isOpen) {
      setSelectedOrganizerId(null)
      setSearchTerm("")
    }
  }, [isOpen])

  const handleSubmit = () => {
    if (event && selectedOrganizerId) {
      onSubmit(event.id, selectedOrganizerId)
    }
  }

  const filteredOrganizers = organizers.filter(
    (organizer) =>
      organizer.id !== event?.organizerId &&
      (organizer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        organizer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        organizer.department.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transferir Propiedad del Evento</DialogTitle>
          <DialogDescription>
            {event ? (
              <>Selecciona un nuevo organizador para el evento "{event.title}".</>
            ) : (
              <>Selecciona un nuevo organizador para este evento.</>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar organizador..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Organizador actual</Label>
            <div className="flex items-center p-3 border rounded-md bg-muted/50">
              <Avatar className="h-9 w-9 mr-3">
                <AvatarImage
                  src={`/placeholder.svg?height=36&width=36&text=${event?.organizerName.charAt(0) || "?"}`}
                  alt={event?.organizerName || "Organizador"}
                />
                <AvatarFallback className="bg-[#67DCD7]">{event?.organizerName.charAt(0) || "?"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{event?.organizerName}</p>
                <p className="text-sm text-muted-foreground">Organizador actual</p>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Seleccionar nuevo organizador</Label>
            <ScrollArea className="h-[200px] border rounded-md">
              {filteredOrganizers.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No se encontraron organizadores.</div>
              ) : (
                <div className="divide-y">
                  {filteredOrganizers.map((organizer) => (
                    <div
                      key={organizer.id}
                      className={`flex items-center p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedOrganizerId === organizer.id ? "bg-muted" : ""
                      }`}
                      onClick={() => setSelectedOrganizerId(organizer.id)}
                    >
                      <Avatar className="h-9 w-9 mr-3">
                        <AvatarImage
                          src={`/placeholder.svg?height=36&width=36&text=${organizer.name.charAt(0)}`}
                          alt={organizer.name}
                        />
                        <AvatarFallback className="bg-[#67DCD7]">{organizer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{organizer.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{organizer.email}</p>
                      </div>
                      <div className="ml-2">
                        <Badge variant="outline">{organizer.department}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            className="bg-[#1C8443] hover:bg-[#1C8443]/90"
            onClick={handleSubmit}
            disabled={!selectedOrganizerId}
          >
            Transferir propiedad
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Badge component for department
const Badge = ({ children, variant }: { children: React.ReactNode; variant: string }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
    {children}
  </span>
)
