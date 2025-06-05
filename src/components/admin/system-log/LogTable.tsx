"use client"

import type React from "react"
import { Eye, Clock, ArrowUpDown } from "lucide-react"
import { Button } from "../../ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../ui/pagination"
import type { SystemLogEntry } from "../../../types/system-log"


interface LogTableProps {
  logs: SystemLogEntry[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onViewDetails: (log: SystemLogEntry) => void
  onSort: (column: keyof SystemLogEntry) => void
  sortColumn?: keyof SystemLogEntry
  sortDirection?: "asc" | "desc"
}

export const LogTable: React.FC<LogTableProps> = ({
  logs,
  currentPage,
  totalPages,
  onPageChange,
  onViewDetails,
  onSort,
  sortColumn,
  sortDirection,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date)
  }

  const formatDuration = (duration?: number) => {
    if (!duration) return "N/A"
    if (duration < 1000) return `${duration}ms`
    return `${(duration / 1000).toFixed(2)}s`
  }

  const renderSortIcon = (column: keyof SystemLogEntry) => {
    if (sortColumn !== column) return <ArrowUpDown className="ml-2 h-4 w-4" />
    return sortDirection === "asc" ? (
      <ArrowUpDown className="ml-2 h-4 w-4 text-[#1C8443]" />
    ) : (
      <ArrowUpDown className="ml-2 h-4 w-4 text-[#1C8443] transform rotate-180" />
    )
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "info":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">
                <Button variant="ghost" onClick={() => onSort("timestamp")} className="flex items-center font-semibold">
                  Fecha y Hora
                  {renderSortIcon("timestamp")}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => onSort("userName")} className="flex items-center font-semibold">
                  Usuario
                  {renderSortIcon("userName")}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => onSort("action")} className="flex items-center font-semibold">
                  Acción
                  {renderSortIcon("action")}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => onSort("module")} className="flex items-center font-semibold">
                  Módulo
                  {renderSortIcon("module")}
                </Button>
              </TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => onSort("duration")} className="flex items-center font-semibold">
                  Duración
                  {renderSortIcon("duration")}
                </Button>
              </TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No se encontraron registros que coincidan con los filtros.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{formatDate(log.timestamp)}</TableCell>
                  <TableCell>{log.userName}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.module}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                        log.status,
                      )}`}
                    >
                      {log.status === "success" && "Éxito"}
                      {log.status === "warning" && "Advertencia"}
                      {log.status === "error" && "Error"}
                      {log.status === "info" && "Información"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                      {formatDuration(log.duration)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetails(log)}
                      className="text-[#38A2C1] hover:text-[#38A2C1]/80 hover:bg-[#38A2C1]/10"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={currentPage === 1 ? undefined : () => onPageChange(Math.max(1, currentPage - 1))}
              aria-disabled={currentPage === 1}
              tabIndex={currentPage === 1 ? -1 : 0}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNumber =
              currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i

            if (pageNumber <= 0 || pageNumber > totalPages) return null

            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink isActive={currentPage === pageNumber} onClick={() => onPageChange(pageNumber)}>
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            )
          })}
          <PaginationItem>
            <PaginationNext
              onClick={currentPage === totalPages ? undefined : () => onPageChange(Math.min(totalPages, currentPage + 1))}
              aria-disabled={currentPage === totalPages}
              tabIndex={currentPage === totalPages ? -1 : 0}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
