"use client"

import type React from "react"
import {
  Calendar,
  MapPin,
  Users,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Eye,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  FileText,
  Share2,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { Event } from "@/types/event"

interface EventsTableProps {
  events: Event[]
  selectedEvents: string[]
  onSelectEvent: (eventId: string, isSelected: boolean) => void
  onSelectAll: (isSelected: boolean) => void
  onEdit: (event: Event) => void
  onDelete: (event: Event) => void
  onDuplicate: (event: Event) => void
  onView: (event: Event) => void
  onPublish: (event: Event) => void
  onTransferOwnership: (event: Event) => void
  onGenerateCertificates: (event: Event) => void
  onSort: (column: string) => void
}

export const EventsTable: React.FC<EventsTableProps> = ({
  events,
  selectedEvents,
  onSelectEvent,
  onSelectAll,
  onEdit,
  onDelete,
  onDuplicate,
  onView,
  onPublish,
  onTransferOwnership,
  onGenerateCertificates,
  onSort,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Borrador
          </Badge>
        )
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Programado
          </Badge>
        )
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Activo
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Completado
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelado
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case "conference":
        return <Badge className="bg-[#1C8443] hover:bg-[#1C8443]/80">Conferencia</Badge>
      case "workshop":
        return <Badge className="bg-[#41AD49] hover:bg-[#41AD49]/80">Taller</Badge>
      case "seminar":
        return <Badge className="bg-[#8DC642] hover:bg-[#8DC642]/80">Seminario</Badge>
      case "course":
        return <Badge className="bg-[#67DCD7] hover:bg-[#67DCD7]/80">Curso</Badge>
      case "meeting":
        return <Badge className="bg-[#38A2C1] hover:bg-[#38A2C1]/80">Reunión</Badge>
      default:
        return <Badge variant="outline">Otro</Badge>
    }
  }

  const allSelected = events.length > 0 && selectedEvents.length === events.length

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <h3 className="text-lg font-medium">Eventos</h3>
          {selectedEvents.length > 0 && (
            <Badge variant="outline" className="ml-2">
              {selectedEvents.length} seleccionados
            </Badge>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox checked={allSelected} onCheckedChange={(checked) => onSelectAll(!!checked)} />
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-1 cursor-pointer" onClick={() => onSort("title")}>
                  <span>Evento</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-1 cursor-pointer" onClick={() => onSort("type")}>
                  <span>Tipo</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-1 cursor-pointer" onClick={() => onSort("startDate")}>
                  <span>Fecha</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-1 cursor-pointer" onClick={() => onSort("status")}>
                  <span>Estado</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-1 cursor-pointer" onClick={() => onSort("organizerName")}>
                  <span>Organizador</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div
                  className="flex items-center space-x-1 cursor-pointer"
                  onClick={() => onSort("registeredAttendees")}
                >
                  <span>Asistentes</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-1 cursor-pointer" onClick={() => onSort("isPublished")}>
                  <span>Publicado</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                  No se encontraron eventos.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedEvents.includes(event.id)}
                      onCheckedChange={(checked) => onSelectEvent(event.id, !!checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                        {event.coverImage ? (
                          <img
                            src={event.coverImage || "/placeholder.svg"}
                            alt={event.title}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        ) : (
                          <Calendar className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">{event.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getEventTypeBadge(event.type)}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                        <span>{formatDate(event.startDate)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="mr-1 h-3 w-3" />
                          <span className="truncate max-w-[150px]">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(event.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage
                          src={`/placeholder.svg?height=28&width=28&text=${event.organizerName.charAt(0)}`}
                        />
                        <AvatarFallback className="bg-[#67DCD7] text-xs">
                          {event.organizerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm truncate max-w-[120px]">{event.organizerName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center">
                            <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span>
                              {event.registeredAttendees} / {event.capacity}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {event.registeredAttendees} asistentes registrados de {event.capacity} disponibles
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    {event.isPublished ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(event)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Ver detalles</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(event)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDuplicate(event)}>
                          <Copy className="mr-2 h-4 w-4" />
                          <span>Duplicar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onPublish(event)}>
                          {event.isPublished ? (
                            <>
                              <XCircle className="mr-2 h-4 w-4" />
                              <span>Despublicar</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              <span>Publicar</span>
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onTransferOwnership(event)}>
                          <Share2 className="mr-2 h-4 w-4" />
                          <span>Transferir propiedad</span>
                        </DropdownMenuItem>
                        {event.status === "completed" && (
                          <DropdownMenuItem onClick={() => onGenerateCertificates(event)}>
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Generar constancias</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => onDelete(event)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Eliminar</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="p-4 border-t border-gray-200">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
