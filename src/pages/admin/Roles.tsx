"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, AlertTriangle, Layers, Shield, FileText, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminLayout } from "@/components/admin/layouts/AdminLayout"
import { RolesList } from "@/components/admin/roles/RolesList"
import { PermissionsMatrix } from "@/components/admin/roles/PermissionsMatrix"
import { RoleForm } from "@/components/admin/roles/RoleForm"
import { CustomPermissionForm } from "@/components/admin/roles/CustomPermissionForm"
import { ModuleForm } from "@/components/admin/roles/ModuleForm"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Role, Permission, Module, RoleWithPermissions } from "@/types/role"

const mockModules: Module[] = [
  {
    id: "1",
    name: "Usuarios",
    key: "usuarios",
    description: "Gestión de usuarios del sistema",
    permissions: [
      {
        id: "1",
        name: "Ver usuarios",
        key: "usuarios.ver",
        description: "Permite ver la lista de usuarios",
        module: "1",
      },
      {
        id: "2",
        name: "Crear usuarios",
        key: "usuarios.crear",
        description: "Permite crear nuevos usuarios",
        module: "1",
      },
      {
        id: "3",
        name: "Editar usuarios",
        key: "usuarios.editar",
        description: "Permite modificar usuarios existentes",
        module: "1",
      },
      {
        id: "4",
        name: "Eliminar usuarios",
        key: "usuarios.eliminar",
        description: "Permite eliminar usuarios del sistema",
        module: "1",
      },
      {
        id: "5",
        name: "Cambiar roles",
        key: "usuarios.cambiar_roles",
        description: "Permite asignar roles a los usuarios",
        module: "1",
      },
    ],
  },
  {
    id: "2",
    name: "Eventos",
    key: "eventos",
    description: "Gestión de eventos del sistema",
    permissions: [
      {
        id: "6",
        name: "Ver eventos",
        key: "eventos.ver",
        description: "Permite ver la lista de eventos",
        module: "2",
      },
      {
        id: "7",
        name: "Crear eventos",
        key: "eventos.crear",
        description: "Permite crear nuevos eventos",
        module: "2",
      },
      {
        id: "8",
        name: "Editar eventos",
        key: "eventos.editar",
        description: "Permite modificar eventos existentes",
        module: "2",
      },
      {
        id: "9",
        name: "Eliminar eventos",
        key: "eventos.eliminar",
        description: "Permite eliminar eventos del sistema",
        module: "2",
      },
      {
        id: "10",
        name: "Publicar eventos",
        key: "eventos.publicar",
        description: "Permite publicar eventos para que sean visibles",
        module: "2",
      },
    ],
  },
  {
    id: "3",
    name: "Constancias",
    key: "constancias",
    description: "Gestión de constancias del sistema",
    permissions: [
      {
        id: "11",
        name: "Ver constancias",
        key: "constancias.ver",
        description: "Permite ver la lista de constancias",
        module: "3",
      },
      {
        id: "12",
        name: "Crear constancias",
        key: "constancias.crear",
        description: "Permite crear nuevas constancias",
        module: "3",
      },
      {
        id: "13",
        name: "Editar constancias",
        key: "constancias.editar",
        description: "Permite modificar constancias existentes",
        module: "3",
      },
      {
        id: "14",
        name: "Eliminar constancias",
        key: "constancias.eliminar",
        description: "Permite eliminar constancias del sistema",
        module: "3",
      },
      {
        id: "15",
        name: "Firmar constancias",
        key: "constancias.firmar",
        description: "Permite firmar constancias para su emisión",
        module: "3",
      },
    ],
  },
  {
    id: "4",
    name: "Reportes",
    key: "reportes",
    description: "Gestión de reportes del sistema",
    permissions: [
      {
        id: "16",
        name: "Ver reportes",
        key: "reportes.ver",
        description: "Permite ver los reportes del sistema",
        module: "4",
      },
      {
        id: "17",
        name: "Exportar reportes",
        key: "reportes.exportar",
        description: "Permite exportar reportes en diferentes formatos",
        module: "4",
      },
      {
        id: "18",
        name: "Crear reportes personalizados",
        key: "reportes.personalizar",
        description: "Permite crear reportes personalizados",
        module: "4",
      },
    ],
  },
  {
    id: "5",
    name: "Configuración",
    key: "configuracion",
    description: "Configuración general del sistema",
    permissions: [
      {
        id: "19",
        name: "Ver configuración",
        key: "configuracion.ver",
        description: "Permite ver la configuración del sistema",
        module: "5",
      },
      {
        id: "20",
        name: "Editar configuración",
        key: "configuracion.editar",
        description: "Permite modificar la configuración del sistema",
        module: "5",
      },
      {
        id: "21",
        name: "Gestionar roles",
        key: "configuracion.roles",
        description: "Permite gestionar los roles del sistema",
        module: "5",
      },
      {
        id: "22",
        name: "Gestionar permisos",
        key: "configuracion.permisos",
        description: "Permite gestionar los permisos del sistema",
        module: "5",
      },
    ],
  },
]

const mockRoles: RoleWithPermissions[] = [
  {
    id: "1",
    name: "Administrador",
    description: "Acceso completo al sistema",
    isSystem: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    permissions: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
    ],
  },
  {
    id: "2",
    name: "Gestor de Eventos",
    description: "Gestiona eventos y constancias",
    isSystem: false,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-02-10T00:00:00Z",
    permissions: ["1", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17"],
  },
  {
    id: "3",
    name: "Editor",
    description: "Puede crear y editar contenido",
    isSystem: false,
    createdAt: "2023-02-01T00:00:00Z",
    updatedAt: "2023-02-15T00:00:00Z",
    permissions: ["1", "6", "7", "8", "11", "12", "13"],
  },
  {
    id: "4",
    name: "Visualizador",
    description: "Solo puede ver información",
    isSystem: true,
    createdAt: "2023-01-05T00:00:00Z",
    updatedAt: "2023-01-05T00:00:00Z",
    permissions: ["1", "6", "11", "16"],
  },
]

export const Roles: React.FC = () => {
  // Estado para roles
  const [roles, setRoles] = useState<RoleWithPermissions[]>(mockRoles)
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<RoleWithPermissions | null>(null)

  // Estado para módulos y permisos
  const [modules, setModules] = useState<Module[]>(mockModules)

  // Estado para formularios
  const [isRoleFormOpen, setIsRoleFormOpen] = useState(false)
  const [isPermissionFormOpen, setIsPermissionFormOpen] = useState(false)
  const [isModuleFormOpen, setIsModuleFormOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState<Partial<Role> | null>(null)
  const [currentPermission, setCurrentPermission] = useState<Partial<Permission> | null>(null)
  const [currentModule, setCurrentModule] = useState<Partial<Module> | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  // Estado para diálogos de confirmación
  const [isDeleteRoleDialogOpen, setIsDeleteRoleDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null)
  const [isDeletePermissionDialogOpen, setIsDeletePermissionDialogOpen] = useState(false)
  const [permissionToDelete, setPermissionToDelete] = useState<string | null>(null)
  const [isDeleteModuleDialogOpen, setIsDeleteModuleDialogOpen] = useState(false)
  const [moduleToDelete, setModuleToDelete] = useState<string | null>(null)

  // Actualizar el rol seleccionado cuando cambia el ID
  useEffect(() => {
    if (selectedRoleId) {
      const role = roles.find((r) => r.id === selectedRoleId)
      setSelectedRole(role || null)
    } else {
      setSelectedRole(null)
    }
  }, [selectedRoleId, roles])

  // Manejadores para roles
  const handleSelectRole = (roleId: string) => {
    setSelectedRoleId(roleId)
  }

  const handleCreateRole = () => {
    setCurrentRole({})
    setIsEditMode(false)
    setIsRoleFormOpen(true)
  }

  const handleEditRole = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId)
    if (role) {
      setCurrentRole(role)
      setIsEditMode(true)
      setIsRoleFormOpen(true)
    }
  }

  const handleDeleteRole = (roleId: string) => {
    setRoleToDelete(roleId)
    setIsDeleteRoleDialogOpen(true)
  }

  const confirmDeleteRole = () => {
    if (roleToDelete) {
      setRoles(roles.filter((r) => r.id !== roleToDelete))
      if (selectedRoleId === roleToDelete) {
        setSelectedRoleId(null)
      }
      setIsDeleteRoleDialogOpen(false)
      setRoleToDelete(null)
    }
  }

  const handleDuplicateRole = (roleId: string) => {
    const roleToDuplicate = roles.find((r) => r.id === roleId)
    if (roleToDuplicate) {
      const newRole: RoleWithPermissions = {
        ...roleToDuplicate,
        id: Date.now().toString(),
        name: `${roleToDuplicate.name} (Copia)`,
        isSystem: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setRoles([...roles, newRole])
    }
  }

  const handleSubmitRole = (roleData: Partial<Role>) => {
    if (isEditMode && currentRole?.id) {
      // Actualizar rol existente
      setRoles(
        roles.map((r) => {
          if (r.id === currentRole.id) {
            return {
              ...r,
              name: roleData.name || r.name,
              description: roleData.description || r.description,
              updatedAt: new Date().toISOString(),
            }
          }
          return r
        }),
      )
    } else {
      // Crear nuevo rol
      const newRole: RoleWithPermissions = {
        id: Date.now().toString(),
        name: roleData.name || "Nuevo Rol",
        description: roleData.description || "",
        isSystem: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        permissions: [],
      }
      setRoles([...roles, newRole])
    }
    setIsRoleFormOpen(false)
    setCurrentRole(null)
  }

  // Manejadores para permisos
  const handlePermissionChange = (permissionId: string, isChecked: boolean) => {
    if (selectedRole) {
      const updatedRole = { ...selectedRole }
      if (isChecked) {
        // Agregar permiso si no existe
        if (!updatedRole.permissions.includes(permissionId)) {
          updatedRole.permissions = [...updatedRole.permissions, permissionId]
        }
      } else {
        // Quitar permiso
        updatedRole.permissions = updatedRole.permissions.filter((id) => id !== permissionId)
      }
      updatedRole.updatedAt = new Date().toISOString()

      // Actualizar el rol en la lista
      setRoles(roles.map((r) => (r.id === selectedRole.id ? updatedRole : r)))
    }
  }

  const handleCreatePermission = () => {
    setCurrentPermission({})
    setIsEditMode(false)
    setIsPermissionFormOpen(true)
  }

  const handleEditPermission = (permissionId: string) => {
    // Buscar el permiso en todos los módulos
    let foundPermission: Permission | undefined
    for (const module of modules) {
      const permission = module.permissions.find((p) => p.id === permissionId)
      if (permission) {
        foundPermission = permission
        break
      }
    }

    if (foundPermission) {
      setCurrentPermission(foundPermission)
      setIsEditMode(true)
      setIsPermissionFormOpen(true)
    }
  }

  const handleDeletePermission = (permissionId: string) => {
    setPermissionToDelete(permissionId)
    setIsDeletePermissionDialogOpen(true)
  }

  const confirmDeletePermission = () => {
    if (permissionToDelete) {
      // Eliminar el permiso de todos los módulos
      const updatedModules = modules.map((module) => ({
        ...module,
        permissions: module.permissions.filter((p) => p.id !== permissionToDelete),
      }))
      setModules(updatedModules)

      // Eliminar el permiso de todos los roles
      const updatedRoles = roles.map((role) => ({
        ...role,
        permissions: role.permissions.filter((id) => id !== permissionToDelete),
      }))
      setRoles(updatedRoles)

      setIsDeletePermissionDialogOpen(false)
      setPermissionToDelete(null)
    }
  }

  const handleSubmitPermission = (permissionData: Partial<Permission>) => {
    if (isEditMode && currentPermission?.id) {
      // Actualizar permiso existente
      const updatedModules = modules.map((module) => {
        if (module.id === permissionData.module) {
          return {
            ...module,
            permissions: module.permissions.map((p) => {
              if (p.id === currentPermission.id) {
                return {
                  ...p,
                  name: permissionData.name || p.name,
                  key: permissionData.key || p.key,
                  description: permissionData.description || p.description,
                  module: permissionData.module || p.module,
                }
              }
              return p
            }),
          }
        } else {
          // Si el módulo ha cambiado, quitar el permiso del módulo anterior
          return {
            ...module,
            permissions: module.permissions.filter((p) => p.id !== currentPermission.id),
          }
        }
      })

      // Si el módulo ha cambiado, agregar el permiso al nuevo módulo
      if (currentPermission.module !== permissionData.module) {
        const targetModuleIndex = updatedModules.findIndex((m) => m.id === permissionData.module)
        if (targetModuleIndex !== -1) {
          const updatedPermission: Permission = {
            id: currentPermission.id,
            name: permissionData.name || currentPermission.name || "",
            key: permissionData.key || currentPermission.key || "",
            description: permissionData.description || currentPermission.description || "",
            module: permissionData.module || currentPermission.module || "",
          }
          updatedModules[targetModuleIndex].permissions.push(updatedPermission)
        }
      }

      setModules(updatedModules)
    } else {
      // Crear nuevo permiso
      const newPermission: Permission = {
        id: Date.now().toString(),
        name: permissionData.name || "Nuevo Permiso",
        key: permissionData.key || "nuevo.permiso",
        description: permissionData.description || "",
        module: permissionData.module || "",
      }

      // Agregar el permiso al módulo correspondiente
      const updatedModules = modules.map((module) => {
        if (module.id === newPermission.module) {
          return {
            ...module,
            permissions: [...module.permissions, newPermission],
          }
        }
        return module
      })

      setModules(updatedModules)
    }
    setIsPermissionFormOpen(false)
    setCurrentPermission(null)
  }

  // Manejadores para módulos
  const handleCreateModule = () => {
    setCurrentModule({})
    setIsEditMode(false)
    setIsModuleFormOpen(true)
  }

  const handleEditModule = (moduleId: string) => {
    const module = modules.find((m) => m.id === moduleId)
    if (module) {
      setCurrentModule(module)
      setIsEditMode(true)
      setIsModuleFormOpen(true)
    }
  }

  const handleDeleteModule = (moduleId: string) => {
    setModuleToDelete(moduleId)
    setIsDeleteModuleDialogOpen(true)
  }

  const confirmDeleteModule = () => {
    if (moduleToDelete) {
      // Obtener todos los permisos del módulo
      const modulePermissions = modules.find((m) => m.id === moduleToDelete)?.permissions.map((p) => p.id) || []

      // Eliminar el módulo
      setModules(modules.filter((m) => m.id !== moduleToDelete))

      // Eliminar los permisos del módulo de todos los roles
      if (modulePermissions.length > 0) {
        const updatedRoles = roles.map((role) => ({
          ...role,
          permissions: role.permissions.filter((id) => !modulePermissions.includes(id)),
        }))
        setRoles(updatedRoles)
      }

      setIsDeleteModuleDialogOpen(false)
      setModuleToDelete(null)
    }
  }

  const handleSubmitModule = (moduleData: Partial<Module>) => {
    if (isEditMode && currentModule?.id) {
      // Actualizar módulo existente
      setModules(
        modules.map((m) => {
          if (m.id === currentModule.id) {
            return {
              ...m,
              name: moduleData.name || m.name,
              key: moduleData.key || m.key,
              description: moduleData.description || m.description,
            }
          }
          return m
        }),
      )
    } else {
      // Crear nuevo módulo
      const newModule: Module = {
        id: Date.now().toString(),
        name: moduleData.name || "Nuevo Módulo",
        key: moduleData.key || "nuevo_modulo",
        description: moduleData.description || "",
        permissions: [],
      }
      setModules([...modules, newModule])
    }
    setIsModuleFormOpen(false)
    setCurrentModule(null)
  }

  // Obtener todos los permisos para la matriz
  const getAllPermissions = () => {
    return modules.flatMap((module) => module.permissions)
  }

  return (
    <AdminLayout title="Roles y Permisos">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Gestión de Roles y Permisos</h1>
            <p className="text-muted-foreground">Administra los roles y permisos del sistema</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCreatePermission}>
              <FileText className="mr-2 h-4 w-4" />
              Nuevo Permiso
            </Button>
            <Button variant="outline" onClick={handleCreateModule}>
              <Layers className="mr-2 h-4 w-4" />
              Nuevo Módulo
            </Button>
            <Button onClick={handleCreateRole} className="bg-[#1C8443] hover:bg-[#1C8443]/90">
              <Shield className="mr-2 h-4 w-4" />
              Nuevo Rol
            </Button>
          </div>
        </div>

        <Tabs defaultValue="roles">
          <TabsList>
            <TabsTrigger value="roles">Roles y Permisos</TabsTrigger>
            <TabsTrigger value="modules">Módulos</TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <RolesList
                  roles={roles}
                  onEditRole={handleEditRole}
                  onDeleteRole={handleDeleteRole}
                  onDuplicateRole={handleDuplicateRole}
                  onSelectRole={handleSelectRole}
                  selectedRoleId={selectedRoleId}
                />
              </div>
              <div className="md:col-span-2">
                <PermissionsMatrix
                  role={selectedRole}
                  modules={modules}
                  onPermissionChange={handlePermissionChange}
                  isReadOnly={selectedRole?.isSystem || false}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="modules">
            <div className="space-y-6">
              {modules.map((module) => (
                <div key={module.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-4 border-b flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">{module.name}</h3>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditModule(module.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteModule(module.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Permisos ({module.permissions.length})</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentPermission({ module: module.id })
                          setIsEditMode(false)
                          setIsPermissionFormOpen(true)
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Permiso
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {module.permissions.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                          No hay permisos definidos para este módulo
                        </p>
                      ) : (
                        module.permissions.map((permission) => (
                          <div
                            key={permission.id}
                            className="border rounded-md p-3 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium">{permission.name}</h5>
                                <p className="text-sm text-muted-foreground">{permission.description}</p>
                                <div className="mt-1">
                                  <span className="inline-block bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded">
                                    {permission.key}
                                  </span>
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleEditPermission(permission.id)}
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Editar</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                                  onClick={() => handleDeletePermission(permission.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Eliminar</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modales y diálogos */}
      <RoleForm
        isOpen={isRoleFormOpen}
        onClose={() => setIsRoleFormOpen(false)}
        role={currentRole}
        onSubmit={handleSubmitRole}
        isEdit={isEditMode}
      />

      <CustomPermissionForm
        isOpen={isPermissionFormOpen}
        onClose={() => setIsPermissionFormOpen(false)}
        permission={currentPermission}
        modules={modules}
        onSubmit={handleSubmitPermission}
        isEdit={isEditMode}
      />

      <ModuleForm
        isOpen={isModuleFormOpen}
        onClose={() => setIsModuleFormOpen(false)}
        module={currentModule}
        onSubmit={handleSubmitModule}
        isEdit={isEditMode}
      />

      <AlertDialog open={isDeleteRoleDialogOpen} onOpenChange={setIsDeleteRoleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el rol y todos sus permisos asociados.
              {roleToDelete && roles.some((r) => r.id === roleToDelete && r.isSystem) && (
                <div className="mt-2 flex items-center text-amber-600">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span>Este es un rol del sistema. Eliminarlo puede afectar el funcionamiento de la aplicación.</span>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteRole} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeletePermissionDialogOpen} onOpenChange={setIsDeletePermissionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el permiso y se quitará de todos los roles
              que lo tengan asignado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeletePermission}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteModuleDialogOpen} onOpenChange={setIsDeleteModuleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el módulo y todos sus permisos asociados.
              Los permisos también se quitarán de todos los roles que los tengan asignados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteModule} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  )
}
