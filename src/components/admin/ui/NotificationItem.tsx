"use client"

import type React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NotificationItemProps {
  title: string
  description: string
  time: string
  onDismiss?: () => void
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ title, description, time, onDismiss }) => {
  return (
    <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-500" onClick={onDismiss}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-gray-400 mt-1">{time}</p>
    </div>
  )
}
