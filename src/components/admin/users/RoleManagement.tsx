"use client"

import type React from "react"
import { Edit, Trash2, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card"
import { Button } from "../../ui/button"
import { Checkbox } from "../../ui/checkbox"
import { Label } from "../../ui/label"
import { Separator } from "../../ui/separator"
import { ScrollArea } from "../../ui/scroll-area"
import type { Role, Permission } from "../../../types/user"


interface RoleManagementProps {
  roles: Role[]
  permissions: Permission[]
  onEditRole: (role: Role) => void
  onDeleteRole: (roleId: string) => void
  onCreateRole: () => void
  onTogglePermission: (roleId: string, permissionId: string, isGranted: boolean) => void
}

export const RoleManagement: React.FC<RoleManagementProps> = ({
  roles,
  permissions,
  onEditRole,
  onDeleteRole,
  onCreateRole,
  onTogglePermission,
}) => {
  // Agrupar permisos por módulo
  const permissionsByModule = permissions.reduce(
    (acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = []
      }
      acc[permission.module].push(permission)
      return acc
    },
    {} as Record<string, Permission[]>,
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Roles y Permisos</h2>
          <p className="text-muted-foreground">Administra los roles y permisos del sistema</p>
        </div>
        <Button onClick={onCreateRole} className="bg-[#1C8443] hover:bg-[#1C8443]/90">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Rol
        </Button>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-6">
          {roles.map((role) => (
            <Card key={role.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{role.name}</CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onEditRole(role)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onDeleteRole(role.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="text-sm font-medium mb-3">Permisos asignados</h4>

                {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                  <div key={module} className="mb-4">
                    <h5 className="text-sm font-medium text-muted-foreground mb-2">{module}</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {modulePermissions.map((permission) => {
                        const isGranted = role.permissions.some((p) => p.id === permission.id)
                        return (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${role.id}-${permission.id}`}
                              checked={isGranted}
                              onCheckedChange={(checked) => onTogglePermission(role.id, permission.id, !!checked)}
                            />
                            <Label htmlFor={`${role.id}-${permission.id}`} className="text-sm cursor-pointer">
                              {permission.name}
                            </Label>
                          </div>
                        )
                      })}
                    </div>
                    <Separator className="my-3" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
