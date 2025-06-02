"use client"

import type React from "react"
import { useState } from "react"
import { Search, ChevronDown, ChevronRight, Info, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Module, RoleWithPermissions } from "@/types/role"

interface PermissionsMatrixProps {
  role: RoleWithPermissions | null
  modules: Module[]
  onPermissionChange: (permissionId: string, isChecked: boolean) => void
  isReadOnly: boolean
}

export const PermissionsMatrix: React.FC<PermissionsMatrixProps> = ({
  role,
  modules,
  onPermissionChange,
  isReadOnly,
}) => {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(
    modules.reduce((acc, module) => ({ ...acc, [module.id]: true }), {}),
  )
  const [searchTerm, setSearchTerm] = useState("")

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }))
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    // Si hay término de búsqueda, expandir todos los módulos
    if (e.target.value) {
      const allExpanded = modules.reduce((acc, module) => ({ ...acc, [module.id]: true }), {})
      setExpandedModules(allExpanded)
    }
  }

  const filteredModules = modules
    .map((module) => ({
      ...module,
      permissions: module.permissions.filter(
        (permission) =>
          permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          permission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          module.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((module) => module.permissions.length > 0)

  const selectAllModulePermissions = (moduleId: string, isChecked: boolean) => {
    const module = modules.find((m) => m.id === moduleId)
    if (module) {
      module.permissions.forEach((permission) => {
        onPermissionChange(permission.id, isChecked)
      })
    }
  }

  if (!role) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center p-8">
            <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Selecciona un rol</h3>
            <p className="text-muted-foreground">Selecciona un rol de la lista para ver y editar sus permisos</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{role.name}</CardTitle>
            <CardDescription>{role.description}</CardDescription>
          </div>
          {isReadOnly && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Solo lectura
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar permisos..." className="pl-8" value={searchTerm} onChange={handleSearch} />
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-18rem)]">
          <div className="p-4">
            {filteredModules.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No se encontraron permisos que coincidan con la búsqueda</p>
              </div>
            ) : (
              filteredModules.map((module) => (
                <div key={module.id} className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 mr-1"
                        onClick={() => toggleModule(module.id)}
                      >
                        {expandedModules[module.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      <h3 className="font-medium">{module.name}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7"
                              onClick={() => selectAllModulePermissions(module.id, true)}
                              disabled={isReadOnly}
                            >
                              <Check className="h-3.5 w-3.5 mr-1" />
                              <span className="text-xs">Todos</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Seleccionar todos los permisos de este módulo</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7"
                              onClick={() => selectAllModulePermissions(module.id, false)}
                              disabled={isReadOnly}
                            >
                              <X className="h-3.5 w-3.5 mr-1" />
                              <span className="text-xs">Ninguno</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Deseleccionar todos los permisos de este módulo</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  {expandedModules[module.id] && (
                    <div className="ml-6 space-y-3">
                      {module.permissions.map((permission) => (
                        <div key={permission.id} className="flex items-start space-x-3">
                          <Checkbox
                            id={permission.id}
                            checked={role.permissions.includes(permission.id)}
                            onCheckedChange={(checked) => onPermissionChange(permission.id, !!checked)}
                            disabled={isReadOnly}
                            className="mt-1"
                          />
                          <div className="space-y-1">
                            <label htmlFor={permission.id} className="font-medium text-sm cursor-pointer">
                              {permission.name}
                            </label>
                            <p className="text-xs text-muted-foreground">{permission.description}</p>
                            <Badge variant="outline" className="text-xs">
                              {permission.key}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <Separator className="mt-4" />
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
