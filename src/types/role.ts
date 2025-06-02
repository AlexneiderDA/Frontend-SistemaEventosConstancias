export interface Role {
  id: string
  name: string
  description: string
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

export interface Permission {
  id: string
  name: string
  key: string
  description: string
  module: string
}

export interface Module {
  id: string
  name: string
  key: string
  description: string
  permissions: Permission[]
}

export interface RolePermission {
  roleId: string
  permissionId: string
}

export interface RoleWithPermissions extends Role {
  permissions: string[] // Array de IDs de permisos
}
