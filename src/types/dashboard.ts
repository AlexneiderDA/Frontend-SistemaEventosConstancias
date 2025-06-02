import type React from "react"
export interface StatCardProps {
  title: string
  value: string
  change: string
  icon: React.ReactNode
}

export interface AlertItemProps {
  type: "error" | "warning" | "info" | "success"
  message: string
  time: string
}

export interface PerformanceIndicatorProps {
  label: string
  value: number
  color: string
}

export interface QuickAccessButtonProps {
  icon: React.ReactNode
  label: string
  color: string
  onClick?: () => void
}
