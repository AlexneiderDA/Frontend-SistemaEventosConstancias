import type React from "react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Button } from "../../components/ui/button"
import { Plus, AlertTriangle } from "lucide-react"
import { AdminLayout } from "../../components/admin/layouts/AdminLayout"
import { UserFiltersComponent } from "../../components/admin/users/UserFilters"
import { UserTable } from "../../components/admin/users/UserTable"
import { UserForm } from "../../components/admin/users/UserForm"
import { ResetPasswordDialog } from "../../components/admin/users/ResetPasswordDialog"
import { RoleManagement } from "../../components/admin/users/RoleManagement"
import { RoleForm } from "../../components/admin/users/RoleForm"
import { ExportOptions } from "../../components/admin/users/ExportOptions"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog"
import type { User, Role, Permission, UserFilters } from "../../types/user"

const mockUsers: User[] = [
  {
    id: "1",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@example.com",
    role: "Administrador",
    department: "Tecnología",
    status: "active",
    lastLogin: "2023-05-12T10:30:00",
    createdAt: "2022-01-15T08:00:00",
  },
  {
    id: "2",
    name: "María López",
    email: "maria.lopez@example.com",
    role: "Editor",
    department: "Marketing",
    status: "active",
    lastLogin: "2023-05-10T14:45:00",
    createdAt: "2022-02-20T09:15:00",
  },
  {
    id: "3",
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    role: "Usuario",
    department: "Ventas",
    status: "inactive",
    lastLogin: "2023-04-28T11:20:00",
    createdAt: "2022-03-05T10:30:00",
  },
  {
    id: "4",
    name: "Ana García",
    email: "ana.garcia@example.com",
    role: "Editor",
    department: "Recursos Humanos",
    status: "active",
    lastLogin: "2023-05-11T09:10:00",
    createdAt: "2022-02-10T11:45:00",
  },
  {
    id: "5",
    name: "Roberto Sánchez",
    email: "roberto.sanchez@example.com",
    role: "Usuario",
    department: "Finanzas",
    status: "active",
    lastLogin: "2023-05-09T16:30:00",
    createdAt: "2022-04-12T13:20:00",
  },
]

const mockRoles: Role[] = [
  {
    id: "1",
    name: "Administrador",
    description: "Acceso completo al sistema",
    permissions: [
      { id: "1", name: "Ver usuarios", description: "Puede ver la lista de usuarios", module: "Usuarios" },
      { id: "2", name: "Crear usuarios", description: "Puede crear nuevos usuarios", module: "Usuarios" },
      { id: "3", name: "Editar usuarios", description: "Puede editar usuarios existentes", module: "Usuarios" },
      { id: "4", name: "Eliminar usuarios", description: "Puede eliminar usuarios", module: "Usuarios" },
      { id: "5", name: "Ver eventos", description: "Puede ver la lista de eventos", module: "Eventos" },
      { id: "6", name: "Crear eventos", description: "Puede crear nuevos eventos", module: "Eventos" },
      { id: "7", name: "Editar eventos", description: "Puede editar eventos existentes", module: "Eventos" },
      { id: "8", name: "Eliminar eventos", description: "Puede eliminar eventos", module: "Eventos" },
    ],
  },
  {
    id: "2",
    name: "Editor",
    description: "Puede crear y editar contenido",
    permissions: [
      { id: "1", name: "Ver usuarios", description: "Puede ver la lista de usuarios", module: "Usuarios" },
      { id: "5", name: "Ver eventos", description: "Puede ver la lista de eventos", module: "Eventos" },
      { id: "6", name: "Crear eventos", description: "Puede crear nuevos eventos", module: "Eventos" },
      { id: "7", name: "Editar eventos", description: "Puede editar eventos existentes", module: "Eventos" },
    ],
  },
  {
    id: "3",
    name: "Usuario",
    description: "Acceso básico al sistema",
    permissions: [
      { id: "1", name: "Ver usuarios", description: "Puede ver la lista de usuarios", module: "Usuarios" },
      { id: "5", name: "Ver eventos", description: "Puede ver la lista de eventos", module: "Eventos" },
    ],
  },
]

const mockPermissions: Permission[] = [
  { id: "1", name: "Ver usuarios", description: "Puede ver la lista de usuarios", module: "Usuarios" },
  { id: "2", name: "Crear usuarios", description: "Puede crear nuevos usuarios", module: "Usuarios" },
  { id: "3", name: "Editar usuarios", description: "Puede editar usuarios existentes", module: "Usuarios" },
  { id: "4", name: "Eliminar usuarios", description: "Puede eliminar usuarios", module: "Usuarios" },
  { id: "5", name: "Ver eventos", description: "Puede ver la lista de eventos", module: "Eventos" },
  { id: "6", name: "Crear eventos", description: "Puede crear nuevos eventos", module: "Eventos" },
  { id: "7", name: "Editar eventos", description: "Puede editar eventos existentes", module: "Eventos" },
  { id: "8", name: "Eliminar eventos", description: "Puede eliminar eventos", module: "Eventos" },
  { id: "9", name: "Ver constancias", description: "Puede ver la lista de constancias", module: "Constancias" },
  { id: "10", name: "Crear constancias", description: "Puede crear nuevas constancias", module: "Constancias" },
  { id: "11", name: "Editar constancias", description: "Puede editar constancias existentes", module: "Constancias" },
  { id: "12", name: "Eliminar constancias", description: "Puede eliminar constancias", module: "Constancias" },
]

const roles = ["Administrador", "Editor", "Usuario"]
const departments = ["Tecnología", "Marketing", "Ventas", "Recursos Humanos", "Finanzas", "Soporte", "Operaciones"]

export const Users: React.FC = () => {
  // Estado para usuarios
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null)
  const [isUserFormOpen, setIsUserFormOpen] = useState(false)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [userToResetPassword, setUserToResetPassword] = useState<User | null>(null)
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  // Estado para roles
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [currentRole, setCurrentRole] = useState<Partial<Role> | null>(null)
  const [isRoleFormOpen, setIsRoleFormOpen] = useState(false)
  const [isDeleteRoleDialogOpen, setIsDeleteRoleDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)

  // Estado para filtros
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    role: "",
    department: "",
    status: "",
    dateRange: {
      from: null,
      to: null,
    },
  })

  // Estado para ordenación
  const [sortColumn, setSortColumn] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Filtrar y ordenar usuarios
  const filteredAndSortedUsers = users
    .filter((user) => {
      // Filtro de búsqueda
      if (
        filters.search &&
        !user.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !user.email.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false
      }

      // Filtro de rol
      if (filters.role && user.role !== filters.role) {
        return false
      }

      // Filtro de departamento
      if (filters.department && user.department !== filters.department) {
        return false
      }

      // Filtro de estado
      if (filters.status && user.status !== filters.status) {
        return false
      }

      // Filtro de fecha
      if (filters.dateRange.from || filters.dateRange.to) {
        const createdDate = new Date(user.createdAt)

        if (filters.dateRange.from && createdDate < filters.dateRange.from) {
          return false
        }

        if (filters.dateRange.to) {
          const endDate = new Date(filters.dateRange.to)
          endDate.setHours(23, 59, 59, 999)
          if (createdDate > endDate) {
            return false
          }
        }
      }

      return true
    })
    .sort((a, b) => {
      // Ordenar por columna seleccionada
      const aValue = a[sortColumn as keyof User] ?? ""
      const bValue = b[sortColumn as keyof User] ?? ""

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1
      }
      return 0
    })

  // Manejadores para usuarios
  const handleFilterChange = (newFilters: UserFilters) => {
    setFilters(newFilters)
  }

  const handleResetFilters = () => {
    setFilters({
      search: "",
      role: "",
      department: "",
      status: "",
      dateRange: {
        from: null,
        to: null,
      },
    })
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleSelectUser = (userId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    }
  }

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedUsers(filteredAndSortedUsers.map((user) => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleCreateUser = () => {
    setCurrentUser({})
    setIsUserFormOpen(true)
  }

  const handleEditUser = (user: User) => {
    setCurrentUser(user)
    setIsUserFormOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user)
    setIsDeleteUserDialogOpen(true)
  }

  const confirmDeleteUser = () => {
    if (userToDelete) {
      setUsers(users.filter((u) => u.id !== userToDelete.id))
      setIsDeleteUserDialogOpen(false)
      setUserToDelete(null)
      // Si el usuario eliminado estaba seleccionado, quitarlo de la selección
      setSelectedUsers(selectedUsers.filter((id) => id !== userToDelete.id))
    }
  }

  const handleResetPassword = (user: User) => {
    setUserToResetPassword(user)
    setIsResetPasswordOpen(true)
  }

  const handleToggleStatus = (user: User) => {
    setUsers(
      users.map((u) => {
        if (u.id === user.id) {
          return {
            ...u,
            status: u.status === "active" ? "inactive" : "active",
          }
        }
        return u
      }),
    )
  }

  const handleSubmitUser = (userData: Partial<User>) => {
    if (userData.id) {
      // Actualizar usuario existente
      setUsers(
        users.map((u) => {
          if (u.id === userData.id) {
            return { ...u, ...userData }
          }
          return u
        }),
      )
    } else {
      // Crear nuevo usuario
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || "",
        email: userData.email || "",
        role: userData.role || "Usuario",
        department: userData.department || "",
        status: userData.status || "active",
        lastLogin: "-",
        createdAt: new Date().toISOString().split("T")[0],
      }
      setUsers([...users, newUser])
    }
    setIsUserFormOpen(false)
    setCurrentUser(null)
  }

  const handleSubmitResetPassword = (userId: string, newPassword: string, sendEmail: boolean) => {
    // En una aplicación real, aquí enviarías la nueva contraseña al backend
    console.log(`Contraseña restablecida para el usuario ${userId}: ${newPassword}`)
    console.log(`Enviar email: ${sendEmail}`)
    setIsResetPasswordOpen(false)
    setUserToResetPassword(null)
  }

  // Manejadores para roles
  const handleCreateRole = () => {
    setCurrentRole({})
    setIsRoleFormOpen(true)
  }

  const handleEditRole = (role: Role) => {
    setCurrentRole(role)
    setIsRoleFormOpen(true)
  }

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId)
    if (role) {
      setRoleToDelete(role)
      setIsDeleteRoleDialogOpen(true)
    }
  }

  const confirmDeleteRole = () => {
    if (roleToDelete) {
      setRoles(roles.filter((r) => r.id !== roleToDelete.id))
      setIsDeleteRoleDialogOpen(false)
      setRoleToDelete(null)
    }
  }

  const handleSubmitRole = (roleData: Partial<Role>) => {
    if (roleData.id) {
      // Actualizar rol existente
      setRoles(
        roles.map((r) => {
          if (r.id === roleData.id) {
            return { ...r, ...roleData }
          }
          return r
        }),
      )
    } else {
      // Crear nuevo rol
      const newRole: Role = {
        id: Date.now().toString(),
        name: roleData.name || "",
        description: roleData.description || "",
        permissions: [],
      }
      setRoles([...roles, newRole])
    }
    setIsRoleFormOpen(false)
    setCurrentRole(null)
  }

  const handleTogglePermission = (roleId: string, permissionId: string, isGranted: boolean) => {
    setRoles(
      roles.map((role) => {
        if (role.id === roleId) {
          if (isGranted) {
            // Agregar permiso
            const permission = mockPermissions.find((p) => p.id === permissionId)
            if (permission && !role.permissions.some((p) => p.id === permissionId)) {
              return {
                ...role,
                permissions: [...role.permissions, permission],
              }
            }
          } else {
            // Quitar permiso
            return {
              ...role,
              permissions: role.permissions.filter((p) => p.id !== permissionId),
            }
          }
        }
        return role
      }),
    )
  }

  // Manejador de exportación
  const handleExport = (format: "csv" | "excel" | "pdf") => {
    // En una aplicación real, aquí generarías el archivo correspondiente
    console.log(`Exportando usuarios en formato ${format}`)
    alert(`Exportación en formato ${format} iniciada`)
  }

  return (
    <AdminLayout title="Usuarios">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">Administra los usuarios del sistema</p>
          </div>
          <div className="flex space-x-2">
            <ExportOptions onExport={handleExport} disabled={filteredAndSortedUsers.length === 0} />
            <Button onClick={handleCreateUser} className="bg-[#1C8443] hover:bg-[#1C8443]/90">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Usuario
            </Button>
          </div>
        </div>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="roles">Roles y Permisos</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <UserFiltersComponent
              filters={filters}
              roles={roles.map((r) => r.name)}
              departments={departments}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />

            <UserTable
              users={filteredAndSortedUsers}
              selectedUsers={selectedUsers}
              onSelectUser={handleSelectUser}
              onSelectAll={handleSelectAll}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              onResetPassword={handleResetPassword}
              onToggleStatus={handleToggleStatus}
              onExport={() => handleExport("csv")}
              onSort={handleSort}
            />
          </TabsContent>

          <TabsContent value="roles">
            <RoleManagement
              roles={roles}
              permissions={mockPermissions}
              onEditRole={handleEditRole}
              onDeleteRole={handleDeleteRole}
              onCreateRole={handleCreateRole}
              onTogglePermission={handleTogglePermission}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modales y diálogos */}
      <UserForm
        isOpen={isUserFormOpen}
        onClose={() => setIsUserFormOpen(false)}
        user={currentUser}
        roles={roles.map((r) => r.name)}
        departments={departments}
        onSubmit={handleSubmitUser}
      />

      <ResetPasswordDialog
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
        user={userToResetPassword}
        onSubmit={handleSubmitResetPassword}
      />

      <RoleForm
        isOpen={isRoleFormOpen}
        onClose={() => setIsRoleFormOpen(false)}
        role={currentRole}
        onSubmit={handleSubmitRole}
      />

      <AlertDialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el usuario
              {userToDelete && ` ${userToDelete.name}`} y toda su información asociada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteRoleDialogOpen} onOpenChange={setIsDeleteRoleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el rol
              {roleToDelete && ` "${roleToDelete.name}"`} y todos sus permisos asociados.
              {roleToDelete && users.some((u) => u.role === roleToDelete.name) && (
                <div className="mt-2 flex items-center text-amber-600">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span>Hay usuarios asignados a este rol. Deberás reasignarlos a otro rol.</span>
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
    </AdminLayout>
  )
}
