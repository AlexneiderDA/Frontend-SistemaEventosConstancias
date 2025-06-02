export interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: "active" | "inactive"
  lastLogin: string
  createdAt: string
  avatar?: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
}

export interface Permission {
  id: string
  name: string
  description: string
  module: string
}

export interface UserFilters {
  search: string
  role: string
  department: string
  status: string
  dateRange: {
    from: Date | null
    to: Date | null
  }
}
