"use client"

import type React from "react"
import { Edit, Trash2, Copy, Shield, Clock } from "lucide-react"
import { Card, CardContent } from "../../ui/card"
import { Button } from "../../ui/button"
import { Badge } from "../../ui/badge"
import { ScrollArea } from "../../ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip"
import type { RoleWithPermissions } from "../../../types/role"


interface RolesListProps {
  roles: RoleWithPermissions[]
  onEditRole: (roleId: string) => void
  onDeleteRole: (roleId: string) => void
  onDuplicateRole: (roleId: string) => void
  onSelectRole: (roleId: string) => void
  selectedRoleId: string | null
}

export const RolesList: React.FC<RolesListProps> = ({
  roles,
  onEditRole,
  onDeleteRole,
  onDuplicateRole,
  onSelectRole,
  selectedRoleId,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="h-full">
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Roles del Sistema</h3>
          <p className="text-sm text-muted-foreground">Selecciona un rol para ver o editar sus permisos</p>
        </div>
        <ScrollArea className="h-[calc(100vh-13rem)]">
          <div className="divide-y">
            {roles.map((role) => (
              <div
                key={role.id}
                className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${
                  selectedRoleId === role.id ? "bg-slate-100" : ""
                }`}
                onClick={() => onSelectRole(role.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <Shield className={`mr-2 h-5 w-5 ${role.isSystem ? "text-[#1C8443]" : "text-[#41AD49]"}`} />
                    <h4 className="font-medium">{role.name}</h4>
                  </div>
                  <div className="flex space-x-1">
                    {role.isSystem ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              Sistema
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Este es un rol del sistema y tiene limitaciones en su edición</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Personalizado
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{role.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>Actualizado: {formatDate(role.updatedAt)}</span>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDuplicateRole(role.id)
                      }}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Duplicar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEditRole(role.id)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    {!role.isSystem && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteRole(role.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <Badge variant="secondary" className="mr-1">
                    {role.permissions.length} permisos
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
