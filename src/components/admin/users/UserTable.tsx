"use client"

import type React from "react"
import { MoreHorizontal, Edit, Trash2, Key, UserCheck, UserX, ArrowUpDown, Download } from "lucide-react"
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
import type { User } from "@/types/user"

interface UserTableProps {
  users: User[]
  selectedUsers: string[]
  onSelectUser: (userId: string, isSelected: boolean) => void
  onSelectAll: (isSelected: boolean) => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onResetPassword: (user: User) => void
  onToggleStatus: (user: User) => void
  onExport: () => void
  onSort: (column: string) => void
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onEdit,
  onDelete,
  onResetPassword,
  onToggleStatus,
  onExport,
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

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return "Hoy"
    } else if (diffDays === 1) {
      return "Ayer"
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`
    } else {
      return formatDate(dateString)
    }
  }

  const allSelected = users.length > 0 && selectedUsers.length === users.length

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <h3 className="text-lg font-medium">Usuarios</h3>
          {selectedUsers.length > 0 && (
            <Badge variant="outline" className="ml-2">
              {selectedUsers.length} seleccionados
            </Badge>
          )}
        </div>
        <div className="flex space-x-2">
          {selectedUsers.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Acciones
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => selectedUsers.forEach((id) => onToggleStatus(users.find((u) => u.id === id)!))}
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>Cambiar estado</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => selectedUsers.forEach((id) => onDelete(users.find((u) => u.id === id)!))}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Eliminar seleccionados</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
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
                <div className="flex items-center space-x-1 cursor-pointer" onClick={() => onSort("name")}>
                  <span>Usuario</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-1 cursor-pointer" onClick={() => onSort("role")}>
                  <span>Rol</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-1 cursor-pointer" onClick={() => onSort("department")}>
                  <span>Departamento</span>
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
                <div className="flex items-center space-x-1 cursor-pointer" onClick={() => onSort("lastLogin")}>
                  <span>Último acceso</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No se encontraron usuarios.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) => onSelectUser(user.id, !!checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={user.avatar || `/placeholder.svg?height=36&width=36&text=${user.name.charAt(0)}`}
                          alt={user.name}
                        />
                        <AvatarFallback className="bg-[#67DCD7]">{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-sm text-muted-foreground">{formatLastLogin(user.lastLogin)}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {new Date(user.lastLogin).toLocaleString("es-ES", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
                        <DropdownMenuItem onClick={() => onEdit(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onResetPassword(user)}>
                          <Key className="mr-2 h-4 w-4" />
                          <span>Restablecer contraseña</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onToggleStatus(user)}>
                          {user.status === "active" ? (
                            <>
                              <UserX className="mr-2 h-4 w-4" />
                              <span>Desactivar</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              <span>Activar</span>
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => onDelete(user)}>
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

const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  switch (role) {
    case "Administrador":
      return <Badge className="bg-[#1C8443] hover:bg-[#1C8443]/80">{role}</Badge>
    case "Editor":
      return <Badge className="bg-[#41AD49] hover:bg-[#41AD49]/80">{role}</Badge>
    case "Usuario":
      return <Badge className="bg-[#8DC642] hover:bg-[#8DC642]/80">{role}</Badge>
    default:
      return <Badge variant="outline">{role}</Badge>
  }
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  return status === "active" ? (
    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
      Activo
    </Badge>
  ) : (
    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
      Inactivo
    </Badge>
  )
}
