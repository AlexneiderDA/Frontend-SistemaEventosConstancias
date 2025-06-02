export interface Event {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  location: string
  type: EventType
  status: EventStatus
  capacity: number
  registeredAttendees: number
  organizerId: string
  organizerName: string
  createdAt: string
  updatedAt: string
  isPublished: boolean
  coverImage?: string
  tags: string[]
}

export type EventType = "conference" | "workshop" | "seminar" | "course" | "meeting" | "other"

export type EventStatus = "draft" | "scheduled" | "active" | "completed" | "cancelled"

export interface EventFilters {
  search: string
  dateRange: {
    from: Date | null
    to: Date | null
  }
  status: EventStatus | "all"
  type: EventType | "all"
  organizer: string
  tags: string[]
  isPublished: boolean | null
}

export interface EventStats {
  total: number
  active: number
  upcoming: number
  completed: number
  cancelled: number
  totalAttendees: number
  averageCapacity: number
}

export interface Organizer {
  id: string
  name: string
  email: string
  department: string
}

export interface EventTag {
  id: string
  name: string
  color: string
}
