"use client"

import type React from "react"
import { Button } from "../../ui/button"
import type { QuickAccessButtonProps } from "../../../types/dashboard"

export const QuickAccessButton: React.FC<QuickAccessButtonProps> = ({ icon, label, color, onClick }) => {
  return (
    <Button
      variant="outline"
      className="flex flex-col items-center justify-center h-24 w-full border-2 hover:border-[#67DCD7] hover:bg-[#67DCD7]/5"
      style={{ borderColor: color }}
      onClick={onClick}
    >
      <div className="p-2 rounded-full mb-2" style={{ backgroundColor: `${color}20` }}>
        <div style={{ color }}>{icon}</div>
      </div>
      <span className="text-xs font-medium text-center">{label}</span>
    </Button>
  )
}
